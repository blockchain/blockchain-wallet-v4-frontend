import Task from 'data.task'
import { addMilliseconds } from 'date-fns'
import * as ethers from 'ethers'
import { initialize } from 'redux-form'
import { call, delay, put, select } from 'typed-redux-saga'

import { Exchange } from '@core'
import { APIType } from '@core/network/api'
import { BuildDexTxParams, DexTransaction } from '@core/network/api/dex/types'
import { CoinType, RatesType } from '@core/types'
import { getPrivateKey } from '@core/utils/eth'
import { actions, model, selectors } from 'data'
import profileSagas from 'data/modules/profile/sagas'
import { Analytics } from 'data/types'
import { promptForSecondPassword } from 'services/sagas'

import * as S from './selectors'
import { actions as A } from './slice'
import { DexSwapForm, DexSwapSide, DexSwapSteps } from './types'
import { getValidSwapAmount } from './utils'
import { parseRawTx } from './utils/parseRawTx'

const { DEFAULT_SLIPPAGE, DEX_SWAP_FORM } = model.components.dex

const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))

const REFRESH_INTERVAL = 15000
const TOKEN_ALLOWANCE_POLL_INTERVAL = 5000
const provider = ethers.providers.getDefaultProvider(`https://api.blockchain.info/eth/nodes/rpc`)
const NATIVE_TOKEN = 'ETH'

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas: any; networks: any }) => {
  const { waitForUserData } = profileSagas({
    api,
    coreSagas,
    networks
  })
  const initiateDex = function* () {
    const isEligible = S.getIsUserEligible(yield select()).getOrElse(false)

    if (!isEligible) return

    const state = yield select()
    const nonCustodialCoinAccounts = yield* select(() =>
      selectors.coins.getCoinAccounts(state, {
        coins: [NATIVE_TOKEN],
        nonCustodialAccounts: true
      })
    )

    if (!nonCustodialCoinAccounts[NATIVE_TOKEN]?.length) {
      yield put(actions.core.data.eth.fetchData())
      yield put(actions.core.data.eth.fetchErc20Data())
    }
    const walletCurrency = yield select(selectors.core.settings.getCurrency)
    const coins = yield select(selectors.core.data.coins.getCoins)
    const erc20Coins: CoinType[] = yield select(selectors.core.data.coins.getErc20Coins)
    const tokens = [NATIVE_TOKEN, ...erc20Coins]
      .map((coin) => {
        const { name, precision, symbol, type } = coins[coin].coinfig

        const balance = selectors.balances
          .getCoinNonCustodialBalance(symbol)(state)
          .getOrElse(ethers.BigNumber.from(0)) as ethers.BigNumber

        let fiatAmount = '0'

        if (balance.toString() !== '0') {
          const rates = selectors.core.data.misc
            .getRatesSelector(symbol, state)
            .getOrElse({} as RatesType)

          fiatAmount = Exchange.convertCoinToFiat({
            coin: symbol,
            currency: walletCurrency,
            rates,
            value: balance.toString()
          })
        }

        const tokenObj = {
          balance,
          fiatAmount: Number(fiatAmount),
          name,
          precision,
          symbol
        }

        if (coin === NATIVE_TOKEN) {
          return {
            ...tokenObj,
            address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          }
        }

        return {
          ...tokenObj,
          address: type.erc20Address
        }
      })
      .sort((a, b) => b.fiatAmount - a.fiatAmount)

    const tokensWithBalance = tokens.filter((token) => token.balance.toString() !== '0')
    const hasTokensWithBalance = tokensWithBalance.length > 0
    const hasNativeBalance = tokensWithBalance.some((token) => token.symbol === NATIVE_TOKEN)

    if (hasTokensWithBalance) {
      yield put(
        initialize(DEX_SWAP_FORM, {
          baseToken: hasNativeBalance ? NATIVE_TOKEN : tokensWithBalance[0].symbol,
          slippage: DEFAULT_SLIPPAGE,
          step: DexSwapSteps.ENTER_DETAILS
        })
      )
      yield put(A.setTokens(tokens))
      yield put(A.fetchChains())
    } else {
      yield put(
        initialize(DEX_SWAP_FORM, {
          step: DexSwapSteps.NO_TOKEN_BALANCES
        })
      )
    }
  }

  const fetchUserEligibility = function* () {
    try {
      yield call(waitForUserData)
      // TODO: since MVP only supports ETH chain
      yield put(A.fetchUserEligibilityLoading())
      const userEligibility = yield* call(api.getDexUserEligibility)
      if (!userEligibility) throw Error('User is not eligible for DEX')
      yield* put(A.fetchUserEligibilitySuccess(userEligibility))
    } catch (e) {
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.DEX_COUNTRY_INELIGIBLE_VIEWED,
          properties: {}
        })
      )
      yield* put(A.fetchUserEligibilityFailure(e.toString()))
    }
  }

  const fetchChains = function* () {
    try {
      yield* put(A.fetchChainsLoading())
      const chainsList = yield* call(api.getDexChains)
      yield* put(A.fetchChainsSuccess(chainsList))

      // since MVP only supports ETH chain, set as current and then pre-fetch token list
      const ethChain = chainsList.find((chain) => chain.nativeCurrency.name === 'Ethereum')
      if (!ethChain) throw Error('No ETH chain found')
      yield* put(A.setCurrentChain(ethChain))
    } catch (e) {
      yield* put(A.fetchChainsFailure(e.toString()))
    }
  }

  const fetchSwapQuote = function* () {
    // create date to cancel loop when current date is more than 15minutes of when this date was created
    const date = new Date()

    while (true) {
      try {
        const formValues = selectors.form.getFormValues(DEX_SWAP_FORM)(
          yield* select()
        ) as DexSwapForm

        if (
          !formValues ||
          formValues.isFlipping ||
          formValues.baseToken === formValues.counterToken
        ) {
          return yield put(A.stopPollSwapQuote())
        }

        const { baseToken, baseTokenAmount, counterToken, counterTokenAmount, slippage } =
          formValues
        if (
          baseToken &&
          counterToken &&
          (getValidSwapAmount(baseTokenAmount) || getValidSwapAmount(counterTokenAmount))
        ) {
          yield* put(A.fetchSwapQuoteLoading())

          const currentChain = selectors.components.dex
            .getCurrentChain(yield* select())
            .getOrFail('Unable to get current chain')

          const baseTokenInfo = selectors.components.dex.getTokenInfo(yield* select(), baseToken)

          // Throw Error if no base token
          if (!baseTokenInfo) {
            throw Error('No base token')
          }

          const baseAmount = Exchange.convertCoinToCoin({
            baseToStandard: false,
            coin: baseToken,
            value: baseTokenAmount || 0
          })

          const counterTokenInfo = selectors.components.dex.getTokenInfo(
            yield* select(),
            counterToken
          )

          // Throw Error if no counter token
          if (!counterTokenInfo) {
            throw Error('No counter token')
          }

          const counterAmount = Exchange.convertCoinToCoin({
            baseToStandard: false,
            coin: counterToken,
            value: counterTokenAmount || 0
          })

          const nonCustodialCoinAccounts = selectors.coins.getCoinAccounts(yield* select(), {
            coins: [baseToken, NATIVE_TOKEN],
            nonCustodialAccounts: true
          })

          const nonCustodialAddress = nonCustodialCoinAccounts[baseToken][0].address

          // Throw Error if no user wallet address
          if (!nonCustodialAddress) {
            throw Error('No user wallet address')
          }

          const sideType = yield select(S.getSwapSideType)

          const quoteResponse = yield* call(api.getDexSwapQuote, {
            fromCurrency: {
              address: baseTokenInfo.address,
              amount: sideType === DexSwapSide.BASE ? baseAmount : undefined,
              chainId: currentChain.chainId,
              symbol: baseToken
            },
            params: {
              slippage: `${slippage}`
            },

            // User always has a private wallet setup automatically on sign up but should go through a security phrase
            // in order to receive funds. If he didn't do it he has 0 balance and just nothing to swap. We don't need
            // any additional checks here to make sure user can use a wallet
            // TODO: Pass selected wallet not the first one when we have more than 1 wallet
            takerAddress: `${nonCustodialAddress}`,

            toCurrency: {
              address: counterTokenInfo.address,
              amount: sideType === DexSwapSide.COUNTER ? counterAmount : undefined,
              chainId: currentChain.chainId,
              symbol: counterToken
            },

            // Hardcoded now. In future get it from: https://{{dex_url}}/v1/venues
            venue: 'ZEROX' as const
          })

          yield* put(
            // @ts-ignore
            A.fetchSwapQuoteSuccess({
              ...quoteResponse,
              date: addMilliseconds(new Date(), quoteResponse.quoteTtl),
              totalMs: quoteResponse.quoteTtl
            })
          )

          const { quote, quoteTtl, transaction } = quoteResponse

          if (quote) {
            const nonEthCustodialbalance = nonCustodialCoinAccounts[NATIVE_TOKEN][0].balance
            const { gasLimit, gasPrice } = transaction
            const gasLimitBn = ethers.BigNumber.from(gasLimit)
            const gasPriceBn = ethers.BigNumber.from(gasPrice)
            const gasFee = gasLimitBn.mul(gasPriceBn)

            if (gasFee.gt(nonEthCustodialbalance)) {
              // eslint-disable-next-line no-throw-literal
              throw {
                message: 'Not enough ETH to cover gas.',
                title: 'Insufficient ETH'
              }
            }

            yield* put(
              actions.form.change(
                DEX_SWAP_FORM,
                'baseTokenAmount',
                Exchange.convertCoinToCoin({
                  baseToStandard: true,
                  coin: quote.sellAmount.symbol,
                  value: quote.sellAmount.amount
                })
              )
            )
            yield* put(
              actions.form.change(
                DEX_SWAP_FORM,
                'counterTokenAmount',
                Exchange.convertCoinToCoin({
                  baseToStandard: true,
                  coin: quote.buyAmount.symbol,
                  value: quote.buyAmount.amount
                })
              )
            )
          }
          yield delay(quoteTtl)

          // cancel loop when current date is more than 15minutes of created date from above line 108 at the time of writing this comment
          if (new Date() > addMilliseconds(date, 15 * 60 * 1000)) {
            yield put(actions.form.reset(DEX_SWAP_FORM))
            yield put(A.resetSwapQuote())
            yield put(A.stopPollSwapQuote())
          }
        }
      } catch ({ message, title }) {
        yield put(A.fetchSwapQuoteFailure({ message, title }))
        yield put(A.stopPollSwapQuote())
      }
    }
  }

  const fetchSwapQuoteOnChange = function* (action) {
    const { field, form, touch } = action?.meta || {}

    // exit if incorrect form changed or the form values were modified by a saga (avoid infinite loop)
    if (form !== DEX_SWAP_FORM || action['@@redux-saga/SAGA_ACTION'] === true) return

    // Don't fetch swap on the following cases:
    // - field is step
    // - touch is undefined and field equals baseTokenAmount or counterTokenAmount
    //   - we only want to fetch when the user was the one who updated the values
    if (
      field === 'step' ||
      (touch === undefined && (field === 'baseTokenAmount' || field === 'counterTokenAmount'))
    )
      return

    const formValues = selectors.form.getFormValues(DEX_SWAP_FORM)(yield* select()) as DexSwapForm
    const { baseToken, baseTokenAmount, counterToken, counterTokenAmount } = formValues

    // if one of the values is 0 set another one to 0 and clear a quote
    if (field === 'baseTokenAmount' && getValidSwapAmount(baseTokenAmount) === 0) {
      yield* put(actions.form.change(DEX_SWAP_FORM, 'counterTokenAmount', ''))
      yield* put(A.clearCurrentSwapQuote())
      return yield put(A.stopPollSwapQuote())
    }

    // if one of the values is 0 set another one to 0 and clear a quote
    if (field === 'counterTokenAmount' && getValidSwapAmount(counterTokenAmount) === 0) {
      yield* put(actions.form.change(DEX_SWAP_FORM, 'baseTokenAmount', ''))
      yield* put(A.clearCurrentSwapQuote())
      return yield put(A.stopPollSwapQuote())
    }

    // reset insufficient balance error if user changes token
    if (field === 'baseToken') {
      const error = yield select(selectors.components.dex.getSwapQuote)
      if (error) yield put(A.clearCurrentSwapQuote())
    }

    // if base amount is not enough, trigger insufficient balance error
    if (
      (field === 'baseTokenAmount' ||
        (field === 'baseToken' && getValidSwapAmount(baseTokenAmount) !== 0) ||
        field === 'counterToken') &&
      baseToken
    ) {
      const token = selectors.components.dex.getTokenInfo(yield* select(), baseToken)
      if (!token) return

      const { balance } = token
      const standardBalance = Exchange.convertCoinToCoin({
        baseToStandard: true,
        coin: baseToken,
        value: balance.toString()
      })

      if (Number(standardBalance) < Number(baseTokenAmount)) {
        yield put(
          A.fetchSwapQuoteFailure({
            message: 'Not enough {symbol} to cover swap.',
            title: 'Insufficient Balance'
          })
        )

        return yield put(A.stopPollSwapQuote())
      }
    }

    if (
      !counterToken ||
      !baseToken ||
      !(getValidSwapAmount(baseTokenAmount) || getValidSwapAmount(counterTokenAmount))
    )
      return

    if (field === 'baseTokenAmount') {
      yield put(A.setSwapSideType(DexSwapSide.BASE))
    } else {
      yield put(A.setSwapSideType(DexSwapSide.COUNTER))
    }

    yield put(A.fetchSwapQuote())
  }

  const fetchTokenAllowance = function* (action: ReturnType<typeof A.fetchTokenAllowance>) {
    const { baseToken } = action.payload
    try {
      yield put(A.fetchTokenAllowanceLoading())
      const nonCustodialCoinAccounts = selectors.coins.getCoinAccounts(yield* select(), {
        coins: [baseToken],
        nonCustodialAccounts: true
      })

      let nonCustodialAddress: string | number | undefined =
        nonCustodialCoinAccounts[baseToken][0].address

      const baseTokenInfo = selectors.components.dex.getTokenInfo(yield* select(), baseToken)
      const tokenAddress = baseTokenInfo?.address || ''

      // Throw Error if no user wallet address
      if (!nonCustodialAddress) throw Error('No user wallet address')

      if (typeof nonCustodialAddress === 'number') {
        nonCustodialAddress = nonCustodialAddress.toString()
      }

      const response = yield call(api.getDexTokenAllowance, {
        addressOwner: nonCustodialAddress,
        currency: tokenAddress,
        network: NATIVE_TOKEN,
        spender: 'ZEROX_EXCHANGE'
      })
      const isTokenAllowed = response?.result.allowance !== '0'
      yield put(A.fetchTokenAllowanceSuccess(isTokenAllowed))
    } catch (e) {
      yield put(A.fetchTokenAllowanceFailure(e))
    }
  }

  const pollTokenAllowance = function* (action: ReturnType<typeof A.pollTokenAllowance>) {
    const { baseToken } = action.payload
    try {
      yield put(A.pollTokenAllowanceLoading())
      const nonCustodialCoinAccounts = selectors.coins.getCoinAccounts(yield* select(), {
        coins: [baseToken],
        nonCustodialAccounts: true
      })

      let nonCustodialAddress: string | number | undefined =
        nonCustodialCoinAccounts[baseToken][0].address

      const baseTokenInfo = selectors.components.dex.getTokenInfo(yield* select(), baseToken)
      const tokenAddress = baseTokenInfo?.address || ''

      // Throw Error if no user wallet address
      if (!nonCustodialAddress) throw Error('No user wallet address')

      if (typeof nonCustodialAddress === 'number') {
        nonCustodialAddress = nonCustodialAddress.toString()
      }

      // poll until api comes back true or 10mins pass (assuming TOKEN_ALLOWANCE_POLL_INTERVAL = 5000)
      let i = 0
      while (i < 120) {
        yield delay(300)
        const response = yield call(api.getDexTokenAllowance, {
          addressOwner: nonCustodialAddress,
          currency: tokenAddress,
          network: NATIVE_TOKEN,
          spender: 'ZEROX_EXCHANGE'
        })
        const isTokenAllowed = response?.result.allowance !== '0'

        if (isTokenAllowed) {
          yield put(A.pollTokenAllowanceSuccess(isTokenAllowed))
          yield put(A.stopPollTokenAllowance())
        }

        yield delay(TOKEN_ALLOWANCE_POLL_INTERVAL)
        i += 1
      }
      throw Error('Token allowance polling timed out')
    } catch (e) {
      yield put(A.pollTokenAllowanceFailure(e))
      yield put(A.stopPollTokenAllowance())
    }
  }

  const getWallet = function* () {
    const password = yield call(promptForSecondPassword)
    const getMnemonic = (state) => selectors.core.wallet.getMnemonic(state, password)
    const mnemonicT = yield select(getMnemonic)
    const mnemonic = yield call(() => taskToPromise(mnemonicT))
    const privateKey = getPrivateKey(mnemonic)
    return new ethers.Wallet(privateKey, provider)
  }

  const pollTokenAllowanceTx = function* (action: ReturnType<typeof A.pollTokenAllowanceTx>) {
    const { baseToken } = action.payload
    try {
      yield put(A.pollTokenAllowanceTxLoading())
      const baseTokenInfo = selectors.components.dex.getTokenInfo(yield* select(), baseToken)
      const tokenAddress = baseTokenInfo?.address || ''
      const wallet = yield call(getWallet)

      const source = {
        descriptor: 'legacy',
        pubKey: wallet.publicKey,
        style: 'SINGLE'
      }
      const tokenAllowanceParams = {
        intent: {
          amount: 'MAX',
          destination: tokenAddress,
          fee: 'NORMAL',
          maxVerificationVersion: 1,
          sources: [source],
          spender: 'ZEROX_EXCHANGE',
          type: 'TOKEN_APPROVAL'
        },
        network: NATIVE_TOKEN
      } as BuildDexTxParams

      while (true) {
        yield delay(300)
        yield put(A.pollTokenAllowanceTxLoading())
        const response = yield call(api.buildDexTx, tokenAllowanceParams)
        const parsedTx = parseRawTx(response)
        const { gasLimit, gasPrice } = response.rawTx.payload
        const gasLimitBn = ethers.BigNumber.from(gasLimit)
        const gasPriceBn = ethers.BigNumber.from(gasPrice)
        const weiGasEstimate = gasLimitBn.mul(gasPriceBn).toString()
        yield put(A.pollTokenAllowanceTxSuccess(parsedTx))
        yield put(A.setTokenAllowanceGasEstimate(weiGasEstimate))

        yield delay(REFRESH_INTERVAL)
      }
    } catch (e) {
      if (e?.error === 'Unable to fetch gas estimate') {
        yield put(
          A.fetchSwapQuoteFailure({
            message: 'Not enough ETH to cover gas.',
            title: 'Insufficient ETH'
          })
        )
        yield put(actions.modals.closeAllModals())
      } else {
        yield put(A.pollTokenAllowanceTxFailure(e))
      }
      yield put(A.stopPollTokenAllowanceTx())
    }
  }

  const sendTokenAllowanceTx = function* (action) {
    const { baseToken } = action.payload

    try {
      const wallet = yield call(getWallet)
      const tx = S.getTokenAllowanceTx(yield select()).getOrElse(null)
      const signedTx = yield call(() => taskToPromise(Task.of(wallet.signTransaction(tx))))
      yield call(() => taskToPromise(Task.of(provider.sendTransaction(signedTx))))
      yield put(A.pollTokenAllowance({ baseToken }))
    } catch (e) {
      yield put(A.sendTokenAllowanceTxFailure(e))
    }
  }

  const sendSwapQuote = function* () {
    yield put(A.stopPollTokenAllowanceTx())
    const { quote, transaction } = S.getSwapQuote(yield select()).getOrElse({
      quote: {},
      transaction: {}
    })

    try {
      if (!quote || !transaction) throw Error('No valid quote')
      yield put(A.sendSwapQuoteLoading())

      const wallet = yield call(getWallet)
      const source = {
        descriptor: 'legacy',
        pubKey: wallet.publicKey,
        style: 'SINGLE'
      }
      const { data, gasLimit: txGasLimit, to, value } = transaction as DexTransaction
      const swapTxParams = {
        intent: {
          destination: to,
          fee: 'NORMAL',
          maxVerificationVersion: 1,
          sources: [source],
          swapTx: {
            data,
            gasLimit: txGasLimit,
            value
          },
          type: 'SWAP'
        },
        network: NATIVE_TOKEN
      } as BuildDexTxParams

      // build dex tx by call api
      const response = yield call(api.buildDexTx, swapTxParams)
      // parse the tx
      const parsedTx = parseRawTx(response)
      // // sign tx
      const signedTx = yield call(() => taskToPromise(Task.of(wallet.signTransaction(parsedTx))))
      // send tx
      const tx = yield call(() => taskToPromise(Task.of(provider.sendTransaction(signedTx))))
      yield put(A.sendSwapQuoteSuccess({ tx: tx.hash }))
      yield put(actions.form.change(DEX_SWAP_FORM, 'step', DexSwapSteps.COMPLETE_SWAP))
    } catch (e) {
      if (e.error === 'Insufficient funds for transaction fees') {
        yield put(
          A.fetchSwapQuoteFailure({
            message: 'Not enough ETH to cover gas.',
            title: 'Insufficient ETH'
          })
        )
        yield put(actions.form.change(DEX_SWAP_FORM, 'step', DexSwapSteps.ENTER_DETAILS))
      } else {
        yield put(A.sendSwapQuoteFailure(e))
        yield put(actions.form.change(DEX_SWAP_FORM, 'step', DexSwapSteps.COMPLETE_SWAP))
      }
    }
  }

  return {
    fetchChains,
    fetchSwapQuote,
    fetchSwapQuoteOnChange,
    fetchTokenAllowance,
    fetchUserEligibility,
    initiateDex,
    pollTokenAllowance,
    pollTokenAllowanceTx,
    sendSwapQuote,
    sendTokenAllowanceTx
  }
}
