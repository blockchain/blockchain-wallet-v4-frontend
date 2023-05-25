import Task from 'data.task'
import * as ethers from 'ethers'
import { call, cancelled, delay, put, select } from 'typed-redux-saga'

import { Exchange } from '@core'
import { APIType } from '@core/network/api'
import { BuildDexTxParams, DexToken } from '@core/network/api/dex/types'
import { cancelRequestSource } from '@core/network/utils'
import { getPrivateKey } from '@core/utils/eth'
import { actions, model, selectors } from 'data'
import { promptForSecondPassword } from 'services/sagas'

import * as S from './selectors'
import { actions as A } from './slice'
import type { DexSwapForm } from './types'
import { getValidSwapAmount } from './utils'
import { parseRawTx } from './utils/parseRawTx'

const { DEX_SWAP_FORM } = model.components.dex

const taskToPromise = (t) => new Promise((resolve, reject) => t.fork(reject, resolve))

const REFRESH_INTERVAL = 30000
const TOKEN_ALLOWANCE_POLL_INTERVAL = 5000
const provider = ethers.providers.getDefaultProvider(`https://api.blockchain.info/eth/nodes/rpc`)

export default ({ api }: { api: APIType }) => {
  const fetchUserEligibility = function* () {
    try {
      // TODO: since MVP only supports ETH chain
      const token = 'ETH'
      const state = yield* select()

      const nonCustodialCoinAccounts = yield* select(() =>
        selectors.coins.getCoinAccounts(state, {
          coins: [token],
          nonCustodialAccounts: true
        })
      )

      const walletAddress = nonCustodialCoinAccounts[token]?.[0].address
      if (!walletAddress) {
        yield* put(A.fetchUserEligibilityFailure('No user wallet address'))
      }

      yield put(A.fetchUserEligibilityLoading())
      // const userEligibility = yield* call(api.getDexUserEligibility, {
      //   walletAddress: `${walletAddress}`
      // })
      const userEligibility = true
      yield* put(A.fetchUserEligibilitySuccess(userEligibility))
    } catch (e) {
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

      if (!ethChain) {
        yield* put(A.fetchChainTokensFailure('Failed to get Ethereum chain'))
        return
      }

      yield* put(A.setCurrentChain(ethChain))
      yield* put(A.fetchChainTokens({ search: '', type: 'RELOAD' }))
    } catch (e) {
      yield* put(A.fetchChainsFailure(e.toString()))
    }
  }

  const fetchChainTokens = function* (action: ReturnType<typeof A.fetchChainTokens>) {
    const cancelSource = cancelRequestSource()
    try {
      yield* put(A.fetchChainTokensLoading())

      const currentChain = selectors.components.dex
        .getCurrentChain(yield* select())
        .getOrFail('Unable to get current chain')
      const tokenList: DexToken[] = yield* call(api.getDexChainTokens, currentChain.chainId, {
        cancelToken: cancelSource.token,
        offset: 0,
        search: action.payload.search
      })

      yield* put(
        A.fetchChainTokensSuccess({
          data: tokenList
        })
      )
    } catch (e) {
      yield* put(A.fetchChainTokensFailure(e.toString()))
    } finally {
      if (yield* cancelled()) {
        yield* call(cancelSource.cancel)
      }
    }
  }

  const fetchSearchedTokens = function* (action: ReturnType<typeof A.fetchSearchedTokens>) {
    const cancelSource = cancelRequestSource()
    const { search } = action.payload
    yield put(A.setSearch(search))
    if (search === '') return yield put(A.fetchSearchedTokensSuccess([]))
    try {
      yield put(A.fetchSearchedTokensLoading())

      const currentChain = S.getCurrentChain(yield select()).getOrFail(
        'Unable to get current chain'
      )

      const tokenList: DexToken[] = yield call(api.searchDexTokens, {
        cancelToken: cancelSource.token,
        chainId: currentChain.chainId,
        search
      })

      yield put(A.fetchSearchedTokensSuccess(tokenList))
    } catch (e) {
      yield* put(A.fetchSearchedTokensFailure(e.toString()))
    } finally {
      if (yield* cancelled()) {
        yield* call(cancelSource.cancel)
      }
    }
  }

  const fetchSwapQuote = function* () {
    yield delay(300)

    while (true) {
      try {
        const formValues = selectors.form.getFormValues(DEX_SWAP_FORM)(
          yield* select()
        ) as DexSwapForm

        // do not request quote on automatic form flip
        if (!formValues) throw Error('No form values')
        if (formValues.isFlipping) throw Error('Flipping base token and counter token')
        if (formValues.baseToken === formValues.counterToken)
          throw Error('Base Tokens and Counter Tokens are the same')

        const { baseToken, baseTokenAmount, counterToken, counterTokenAmount, slippage } =
          formValues

        if (baseToken && counterToken && getValidSwapAmount(baseTokenAmount)) {
          yield* put(A.fetchSwapQuoteLoading())

          const currentChain = selectors.components.dex
            .getCurrentChain(yield* select())
            .getOrFail('Unable to get current chain')

          const baseTokenInfo = selectors.components.dex
            .getChainTokenInfo(yield* select(), baseToken)
            .getOrFail('Unable to get base token info')

          // Throw Error if no base token
          if (!baseTokenInfo) {
            throw Error('No base token')
          }

          const baseAmountGwei = Exchange.convertCoinToCoin({
            baseToStandard: false,
            coin: currentChain.nativeCurrency.symbol,
            value: baseTokenAmount || 0
          })

          const counterTokenInfo = selectors.components.dex
            .getChainTokenInfo(yield* select(), counterToken)
            .getOrFail('Unable to get counter token info')

          // Throw Error if no counter token
          if (!counterTokenInfo) {
            throw Error('No counter token')
          }

          const nonCustodialCoinAccounts = selectors.coins.getCoinAccounts(yield* select(), {
            coins: [baseToken],
            nonCustodialAccounts: true
          })

          const nonCustodialAddress = nonCustodialCoinAccounts[baseToken][0].address

          // Throw Error if no user wallet address
          if (!nonCustodialAddress) {
            throw Error('No user wallet address')
          }

          const quoteResponse = yield* call(api.getDexSwapQuote, {
            fromCurrency: {
              address: baseTokenInfo.address,
              amount: baseAmountGwei,
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
              chainId: currentChain.chainId,
              symbol: counterToken
            },

            // Hardcoded now. In future get it from: https://{{dex_url}}/v1/venues
            venue: 'ZEROX' as const
          })
          yield* put(A.fetchSwapQuoteSuccess(quoteResponse))

          // We have a list of quotes but it's valid only for cross chains transactions that we currently don't have
          // Also we consider to return to the FE only one quote in that case
          const { quote } = quoteResponse

          if (quote) {
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

          yield delay(REFRESH_INTERVAL)
        }
      } catch (e) {
        yield put(A.fetchSwapQuoteFailure(e))
        yield put(A.stopPollSwapQuote())
      }
    }
  }

  const fetchSwapQuoteOnChange = function* (action) {
    const { field, form } = action?.meta

    // exit whenever the counterTokenAmount changes, to avoid infinitely calling fetchSwapQuote
    if (field === 'counterTokenAmount') return

    // exit if incorrect form changed or the form values were modified by a saga (avoid infinite loop)
    if (form !== DEX_SWAP_FORM || action['@@redux-saga/SAGA_ACTION'] === true) return
    const formValues = selectors.form.getFormValues(DEX_SWAP_FORM)(yield* select()) as DexSwapForm

    // if one of the values is 0 set another one to 0 and clear a quote
    if (field === 'baseTokenAmount' && getValidSwapAmount(formValues.baseTokenAmount) === 0) {
      yield* put(actions.form.change(DEX_SWAP_FORM, 'counterTokenAmount', ''))
      yield* put(A.clearCurrentSwapQuote())
      return
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

      const baseTokenInfo = selectors.components.dex
        .getChainTokenInfo(yield* select(), baseToken)
        .getOrFail('Unable to get base token info')
      const tokenAddress = baseTokenInfo?.address || ''

      // Throw Error if no user wallet address
      if (!nonCustodialAddress) throw Error('No user wallet address')

      if (typeof nonCustodialAddress === 'number') {
        nonCustodialAddress = nonCustodialAddress.toString()
      }

      const response = yield call(api.getDexTokenAllowance, {
        addressOwner: nonCustodialAddress,
        currency: tokenAddress,
        network: 'ETH',
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

      const baseTokenInfo = selectors.components.dex
        .getChainTokenInfo(yield* select(), baseToken)
        .getOrFail('Unable to get base token info')
      const tokenAddress = baseTokenInfo?.address || ''

      // Throw Error if no user wallet address
      if (!nonCustodialAddress) throw Error('No user wallet address')

      if (typeof nonCustodialAddress === 'number') {
        nonCustodialAddress = nonCustodialAddress.toString()
      }

      // keep polling until api comes back true.
      while (true) {
        yield delay(300)
        const response = yield call(api.getDexTokenAllowance, {
          addressOwner: nonCustodialAddress,
          currency: tokenAddress,
          network: 'ETH',
          spender: 'ZEROX_EXCHANGE'
        })
        const isTokenAllowed = response?.result.allowance !== '0'

        if (isTokenAllowed) {
          yield put(A.pollTokenAllowanceSuccess(isTokenAllowed))
          yield put(A.stopPollTokenAllowance())
        }

        yield delay(TOKEN_ALLOWANCE_POLL_INTERVAL)
      }
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
    const wallet = new ethers.Wallet(privateKey, provider)
    return wallet
  }

  const pollTokenAllowanceTx = function* (action: ReturnType<typeof A.pollTokenAllowanceTx>) {
    const { baseToken } = action.payload
    try {
      yield put(A.pollTokenAllowanceTxLoading())
      const baseTokenInfo = selectors.components.dex
        .getChainTokenInfo(yield* select(), baseToken)
        .getOrFail('Unable to get base token info')
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
        network: 'ETH'
      } as BuildDexTxParams

      while (true) {
        yield delay(300)
        yield put(A.pollTokenAllowanceTxLoading())
        const response = yield call(api.buildDexTx, tokenAllowanceParams)
        const parsedTx = parseRawTx(response)
        const { gasLimit, gasPrice } = response.rawTx.payload
        const gasLimitBn = ethers.BigNumber.from(gasLimit.hex)
        const gasPriceBn = ethers.BigNumber.from(gasPrice.hex)
        const weiGasEstimate = gasLimitBn.mul(gasPriceBn).toString()
        yield put(A.pollTokenAllowanceTxSuccess(parsedTx))
        yield put(A.setTokenAllowanceGasEstimate(weiGasEstimate))

        yield delay(REFRESH_INTERVAL)
      }
    } catch (e) {
      yield put(A.pollTokenAllowanceTxFailure(e))
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

  return {
    fetchChainTokens,
    fetchChains,
    fetchSearchedTokens,
    fetchSwapQuote,
    fetchSwapQuoteOnChange,
    fetchTokenAllowance,
    fetchUserEligibility,
    pollTokenAllowance,
    pollTokenAllowanceTx,
    sendTokenAllowanceTx
  }
}
