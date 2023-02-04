import { SEND_FORM } from 'blockchain-wallet-v4-frontend/src/modals/SendCrypto/model'
import { SendFormType } from 'blockchain-wallet-v4-frontend/src/modals/SendCrypto/types'
import * as ethers from 'ethers'
import { call, delay, put, select } from 'redux-saga/effects'
import secp256k1 from 'secp256k1'

import { convertCoinToCoin, convertFiatToCoin } from '@core/exchange'
import { APIType } from '@core/network/api'
import { BuildTxIntentType, BuildTxResponseType } from '@core/network/api/coins/types'
import { getCoinNetworksAndTypes } from '@core/redux/data/coins/selectors'
import { getPrivKey, getPubKey } from '@core/redux/data/self-custody/sagas'
import { FiatType, WalletAccountEnum } from '@core/types'
import { errorHandler } from '@core/utils'
import { actions, selectors } from 'data'
import { SwapBaseCounterTypes } from 'data/components/swap/types'
import { ModalName, ModalNameType } from 'data/modals/types'
import { Analytics } from 'data/types'
import { AccountType } from 'middleware/analyticsMiddleware/types'
import { promptForSecondPassword } from 'services/sagas'

import * as S from './selectors'
import { actions as A } from './slice'
import { SendCryptoStepType } from './types'

const getNetwork = (coin: string) => {
  if (coin.includes('.')) {
    return coin.split('.')[1]
  }

  return coin
}

export default ({ api }: { api: APIType }) => {
  const initializeSend = function* () {
    const totalBalanceR = yield select(selectors.balances.getTotalWalletBalanceNotFormatted)
    const totalBalance = totalBalanceR.getOrElse({ total: 0 })

    if (totalBalance?.total === 0) {
      yield put(A.setStep({ step: SendCryptoStepType.NO_FUNDS }))
    } else {
      yield put(A.setStep({ step: SendCryptoStepType.COIN_SELECTION }))
    }
  }

  const buildTx = function* (action: ReturnType<typeof A.buildTx>) {
    let coin
    let fee
    let accountType
    try {
      yield put(A.buildTxLoading())
      const { account, baseCryptoAmt, destination, fee, memo } = action.payload
      const { coin } = account
      const feesR = S.getWithdrawalFees(yield select(), coin)

      if (account.type === SwapBaseCounterTypes.ACCOUNT) {
        const password = yield call(promptForSecondPassword)
        const pubKey = yield call(getPubKey, coin, password)
        const guid = yield select(selectors.core.wallet.getGuid)
        const [uuid] = yield call(api.generateUUIDs, 1)

        const tx: ReturnType<typeof api.buildTx> = yield call(api.buildTx, coin, {
          id: {
            guid,
            uuid
          },
          intent: {
            amount: baseCryptoAmt,
            currency: 'native',
            destination,
            extraData: {
              memo
            },
            fee,
            sources: [
              {
                descriptor: 'legacy',
                pubKey,
                style: 'SINGLE'
              }
            ],
            type: 'PAYMENT'
          } as BuildTxIntentType,
          network: getNetwork(coin)
        })

        yield put(A.buildTxSuccess(tx))
      } else {
        // fee
        const standardCryptoFee = feesR.getOrElse(0) || 0
        const baseCryptoFee = convertCoinToCoin({
          baseToStandard: false,
          coin,
          value: standardCryptoFee
        })

        yield put(
          A.buildTxSuccess({
            summary: {
              absoluteFeeEstimate: baseCryptoFee,
              absoluteFeeMaximum: baseCryptoFee,
              amount: baseCryptoAmt,
              balance: account.balance as string,
              relativeFee: baseCryptoFee
            }
          })
        )
      }
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.SEND_AMOUNT_ENTERED,
          properties: {
            currency: coin,
            fee_rate: fee,
            from_account_type: account.type,
            originalTimestamp: new Date().toISOString(),
            to_account_type: AccountType.USERKEY
          }
        })
      )
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.buildTxFailure(error))
      yield put(
        actions.analytics.trackEvent({
          key: Analytics.SEND_FAILED,
          properties: {
            currency: coin,
            fee_rate: fee,
            from_account_type: accountType,
            originalTimestamp: new Date().toISOString(),
            to_account_type: AccountType.USERKEY
          }
        })
      )
    }
  }

  const fetchFeesAndMins = function* ({ payload }: ReturnType<typeof A.fetchWithdrawalFees>) {
    yield put(A.fetchWithdrawalFeesLoading())
    try {
      if (payload.account && payload.account.type === SwapBaseCounterTypes.ACCOUNT) {
        yield put(
          A.fetchWithdrawalFeesSuccess({
            feeType: 'NETWORK',
            fees: [{ minorValue: '1000000', symbol: payload.account.coin, value: 1 }],
            minAmounts: [{ minorValue: '0', symbol: payload.account.coin, value: 0 }]
          })
        )
      } else {
        const withdrawalFees: ReturnType<typeof api.getWithdrawalFees> = yield call(
          api.getWithdrawalFees,
          'simplebuy'
        )

        yield put(A.fetchWithdrawalFeesSuccess(withdrawalFees))
      }
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchWithdrawalFeesFailure(error))
    }
  }

  const fetchLocks = function* () {
    yield put(A.fetchWithdrawalLocksLoading())
    const currency = selectors.components.brokerage.getFiatCurrency(yield select()) as FiatType
    try {
      const withdrawalFees: ReturnType<typeof api.getWithdrawalLocks> = yield call(
        api.getWithdrawalLocks,
        currency
      )

      yield put(A.fetchWithdrawalLocksSuccess(withdrawalFees))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchWithdrawalLocksFailure(error))
    }
  }

  // TODO: remove when all tokens are moved to sendCrypto
  // This switches between the flyout and the old modal
  // depending on the crypto you're sending.
  const onFormChange = function* (action: {
    meta: { field: string; form: string }
    payload: string
  }) {
    const { meta, payload } = action
    const { field, form } = meta

    if (form.includes('SEND') && field === 'coin') {
      yield put(actions.modals.closeAllModals())
      if (
        (selectors.core.data.coins.getCustodialCoins().includes(payload) ||
          selectors.core.data.coins.getDynamicSelfCustodyCoins().includes(payload)) &&
        // TODO - remove this once when we make this dynamic
        payload !== 'BTC' &&
        payload !== 'BCH' &&
        payload !== 'XLM' &&
        payload !== 'ETH'
      ) {
        // must come before show modal
        yield put(A.setInitialCoin(payload))
        // must come after setInitialCoin
        yield put(actions.modals.showModal(ModalName.SEND_CRYPTO_MODAL, { origin: 'Send' }))
      } else {
        const coin = window.coins[payload].coinfig.type.erc20Address ? 'ETH' : payload
        yield put(
          actions.modals.showModal(`SEND_${coin}_MODAL` as ModalNameType, {
            coin: payload,
            origin: 'Send'
          })
        )
      }
    }
  }

  const signTx = function* (coin: string, prebuildTx: BuildTxResponseType, password: string) {
    const privateKey = yield call(getPrivKey, coin, password)

    if (!privateKey) throw new Error('Could not derive private key')

    const signedTx = prebuildTx
    const signedPreImages = prebuildTx.preImages.map((preImage) => {
      // @ts-ignore
      const { recovery, signature } = secp256k1.sign(
        Buffer.from(
          preImage.preImage.startsWith('0x') ? preImage.preImage.substr(2) : preImage.preImage,
          'hex'
        ),
        Buffer.from(privateKey, 'hex')
      )

      // eslint-disable-next-line no-buffer-constructor
      const recoveryBuffer = new Buffer(1)
      recoveryBuffer.writeUInt8(recovery)
      preImage.signature = Buffer.concat([signature, recoveryBuffer]).toString('hex')
      return preImage
    })

    signedTx.preImages = signedPreImages

    return signedTx
  }

  const submitTransaction = function* () {
    let coin
    let prebuildTxFee
    let accountType

    try {
      yield put(A.setStep({ step: SendCryptoStepType.STATUS }))
      yield put(A.submitTransactionLoading())
      const formValues = selectors.form.getFormValues(SEND_FORM)(yield select()) as SendFormType
      const { amount, fix, memo, selectedAccount, to } = formValues
      coin = selectedAccount.coin
      accountType = selectedAccount.type
      const feesR = S.getWithdrawalFees(yield select(), selectedAccount.coin)
      const fee = feesR.getOrElse(undefined)
      const walletCurrency = (yield select(selectors.core.settings.getCurrency)).getOrElse('USD')

      const rates = selectors.core.data.misc
        .getRatesSelector(coin, yield select())
        .getOrFail('Failed to get rates')

      if (selectedAccount.type === SwapBaseCounterTypes.ACCOUNT) {
        const password = yield call(promptForSecondPassword)
        const guid = yield select(selectors.core.wallet.getGuid)
        const [uuid] = yield call(api.generateUUIDs, 1)
        const prebuildTx = S.getPrebuildTx(yield select()).getOrFail(
          'No prebuildTx'
        ) as BuildTxResponseType
        prebuildTxFee = prebuildTx.summary.absoluteFeeEstimate
        const signedTx: BuildTxResponseType = yield call(signTx, coin, prebuildTx, password)
        const pushedTx: ReturnType<typeof api.pushTx> = yield call(
          api.pushTx,
          coin,
          signedTx.rawTx,
          signedTx.preImages,
          {
            guid,
            uuid
          },
          getNetwork(coin)
        )

        const value = convertCoinToCoin({
          baseToStandard: true,
          coin,
          value: prebuildTx.summary.amount
        })

        if (pushedTx.txId) {
          yield put(
            A.submitTransactionSuccess({
              amount: { symbol: coin, value }
            })
          )
          yield delay(2000)
          yield put(actions.core.data.coins.fetchTransactions({ coin, reset: true }))
        } else {
          throw new Error('Failed to submit transaction.')
        }
      } else {
        const amountToSend =
          fix === 'FIAT'
            ? convertFiatToCoin({
                coin,
                currency: walletCurrency,
                rates,
                value: amount
              })
            : amount

        const finalAmt = convertCoinToCoin({ baseToStandard: false, coin, value: amountToSend })
        const finalFee = convertCoinToCoin({ baseToStandard: false, coin, value: fee || 0 })

        const response: ReturnType<typeof api.withdrawBSFunds> = yield call(
          api.withdrawBSFunds,
          memo ? `${to}:${memo}` : to,
          coin,
          finalAmt,
          Number(finalFee)
        )
        yield put(A.submitTransactionSuccess({ amount: response.amount }))
      }

      yield put(
        actions.analytics.trackEvent({
          key: Analytics.SEND_SUBMITTED,
          properties: {
            currency: coin,
            fee_rate: fee,
            from_account_type: selectedAccount.type,
            originalTimestamp: new Date().toISOString(),
            to_account_type: AccountType.USERKEY
          }
        })
      )
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.submitTransactionFailure(error))

      yield put(
        actions.analytics.trackEvent({
          key: Analytics.SEND_FAILED,
          properties: {
            currency: coin,
            fee_rate: prebuildTxFee,
            from_account_type: accountType,
            originalTimestamp: new Date().toISOString(),
            to_account_type: AccountType.USERKEY
          }
        })
      )
    }
  }

  const fetchSendLimits = function* ({ payload }: ReturnType<typeof A.fetchSendLimits>) {
    const state = yield select()
    const { coin, type } = payload.account

    if (type !== SwapBaseCounterTypes.CUSTODIAL) {
      return
    }

    const currency = selectors.core.settings.getCurrency(state).getOrElse('USD')
    try {
      yield put(A.fetchSendLimitsLoading())
      const limitsResponse: ReturnType<typeof api.getCrossBorderTransactions> = yield call(
        api.getCrossBorderTransactions,
        coin,
        WalletAccountEnum.CUSTODIAL,
        coin,
        WalletAccountEnum.NON_CUSTODIAL,
        currency
      )
      yield put(A.fetchSendLimitsSuccess(limitsResponse))
    } catch (e) {
      yield put(A.fetchSendLimitsFailure(e))
    }
  }

  const validateAddress = function* ({ payload }: ReturnType<typeof A.validateAddress>) {
    const { address, coin } = payload

    const isDynamicSelfCustody = window.coins[coin].coinfig.products.includes('DynamicSelfCustody')

    try {
      if (!isDynamicSelfCustody) {
        yield put(A.validateAddressSuccess(!!address.match(/[a-zA-Z0-9]{15,}/)))
        return
      }

      const response: ReturnType<typeof api.validateAddress> = yield call(
        api.validateAddress,
        coin,
        address
      )
      yield put(A.validateAddressSuccess(response.success))
    } catch (e) {
      yield put(A.validateAddressFailure(e))
    }
  }

  return {
    buildTx,
    fetchFeesAndMins,
    fetchLocks,
    fetchSendLimits,
    initializeSend,
    onFormChange,
    // fetchTransactionDetails,
    submitTransaction,
    validateAddress
  }
}
