import BigNumber from 'bignumber.js'
import * as Bitcoin from 'bitcoinjs-lib'
import { SEND_FORM } from 'blockchain-wallet-v4-frontend/src/modals/SendCrypto/model'
import { SendFormType } from 'blockchain-wallet-v4-frontend/src/modals/SendCrypto/types'
import { nth } from 'ramda'
import { call, delay, put, select } from 'redux-saga/effects'
import secp256k1 from 'secp256k1'

import { Exchange, utils } from '@core'
import { convertCoinToCoin, convertFiatToCoin } from '@core/exchange'
import { APIType } from '@core/network/api'
import { BuildTxIntentType, BuildTxResponseType } from '@core/network/api/coin/types'
import { getPrivKey, getPubKey } from '@core/redux/data/self-custody/sagas'
import { ADDRESS_TYPES } from '@core/redux/payment/btc/utils'
import { BtcPaymentType, FiatType, PaymentValue, WalletAccountEnum } from '@core/types'
import { errorHandler } from '@core/utils'
import { actions, selectors } from 'data'
import { SwapBaseCounterTypes } from 'data/components/swap/types'
import { ModalName, ModalNameType } from 'data/modals/types'
import { Analytics } from 'data/types'
import { AccountType } from 'middleware/analyticsMiddleware/types'
import { promptForSecondPassword } from 'services/sagas'

import coinSagas from '../../coins/sagas'
import sendSagas from '../send/sagas'
import * as S from './selectors'
import { actions as A } from './slice'
import { SendCryptoStepType } from './types'

const nonMigratedCoins = [
  'BTC',
  'ETH'
  // , 'BCH', 'ETH', 'XLM'
]

export const logLocation = 'components/sendCrypto/sagas'

export default ({ api, coreSagas, networks }: { api: APIType; coreSagas: any; networks: any }) => {
  const { showWithdrawalLockAlert } = sendSagas({
    api,
    coreSagas,
    networks
  })

  const { getNextReceiveAddressForCoin } = coinSagas({
    api,
    coreSagas,
    networks
  })

  const initializeSend = function* () {
    const totalBalanceR = yield select(selectors.balances.getTotalWalletBalanceNotFormatted)
    const totalBalance = totalBalanceR.getOrElse({ total: 0 })

    if (totalBalance?.total === 0) {
      yield put(A.setStep({ step: SendCryptoStepType.NO_FUNDS }))
    } else {
      yield put(A.setStep({ step: SendCryptoStepType.COIN_SELECTION }))
    }
  }

  // TODO add a new if case for trading accounts BTC
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
        const pubKey = yield call(getPubKey, password)
        const guid = yield select(selectors.core.wallet.getGuid)
        const [uuid] = yield call(api.generateUUIDs, 1)

        if (nonMigratedCoins.includes(coin)) {
          // TODO simulate buildTx logic for non migrated coins
          // only PK accounts will go here
          // return

          // console.log('all details', { account, baseCryptoAmt, destination, fee, memo })
          const accountsR = yield select(selectors.core.common.btc.getAccountsBalances)
          // const txS = yield select(selectors.core.common.btc.getWalletTransactions)
          // console.log('txS', txS)
          if (account.accountIndex !== undefined) {
            // const defaultAccount = accountsR.map(nth(account?.accountIndex)).getOrElse({})
            // console.log('defaultAccountR', defaultAccount)
            // const pubb = Bitcoin.payments.p2pkh({
            //   pubkey: Bitcoin.bip32.fromBase58(defaultAccount.xpub).derive(0).derive(1).publicKey
            // })
            // const addressDefault = yield call(getNextReceiveAddressForCoin, coin)
            // console.log('addresst', pubb.address)
            // console.log('address6', addressDefault)
            // const addresst = utils.btc.keyPairToAddress(defaultAccount.xpub)
            // console.log('addresst', addresst)
            // const defaultAccount = allAccount[account.accountIndex]
            // console.log('defaultAccount', defaultAccount)
          }

          // console.log('defaultAccount', defaultAccount)

          const tx = {} as BuildTxResponseType

          if (coin === 'BTC') {
            // const txBTC = new Bitcoin.TransactionBuilder()

            let payment = coreSagas.payment.btc.create({
              network: networks.btc
            })
            payment = yield payment.init()

            payment = yield payment.from(account.accountIndex, ADDRESS_TYPES.ACCOUNT)

            // console.log('payment', payment)

            // from
            payment = yield payment.from(account.index, account.type)
            // to
            payment = yield payment.to(destination, account.type)
            // amount
            const satAmount = Exchange.convertCoinToCoin({
              baseToStandard: false,
              coin,
              value: baseCryptoAmt
            })
            payment = yield payment.amount(parseInt(satAmount))

            // build transaction
            try {
              payment = yield payment.build()

              // console.log('payment ready', payment.value())
            } catch (e) {
              yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
            }
            // console.log('pubKey', pubKey)
            // console.log('txBTC', txBTC)
          }

          yield put(A.buildTxSuccess(tx))
          return
        }
        const tx: ReturnType<typeof api.buildTx> = yield call(api.buildTx, {
          id: {
            guid,
            uuid
          },
          intent: {
            amount: baseCryptoAmt,
            currency: coin,
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
          } as BuildTxIntentType
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

  // helper function to send BTC amount
  const submitBTCTransaction = function* () {
    // TODO double check do we need initial part since here we already know a few things

    const p = S.getPayment(yield select())?.getOrElse({} as PaymentValue)
    let payment: BtcPaymentType = coreSagas.payment.btc.create({
      network: networks.btc,
      payment: p || ({} as PaymentValue)
    })

    const formValues = selectors.form.getFormValues(SEND_FORM)(yield select()) as SendFormType
    const { amount, coin, fix, payPro, selectedAccount, to } = formValues
    const { fromType } = payment.value()
    try {
      // Sign payment
      let password
      if (fromType !== ADDRESS_TYPES.WATCH_ONLY) {
        password = yield call(promptForSecondPassword)
      }
      if (fromType !== ADDRESS_TYPES.CUSTODIAL) {
        payment = yield payment.sign(password)
      }
      // Publish payment
      if (payPro) {
        // @ts-ignore
        const { txHex, weightedSize } = payment.value()
        const invoiceId = payPro.paymentUrl.split('/i/')[1]
        yield call(
          // @ts-ignore
          api.verifyPaymentRequest,
          invoiceId,
          txHex,
          weightedSize,
          coin
        )
        yield delay(3000)
        yield call(
          // @ts-ignore
          api.submitPaymentRequest,
          invoiceId,
          txHex,
          weightedSize,
          coin
        )
      } else if (fromType === ADDRESS_TYPES.CUSTODIAL) {
        const value = payment.value()
        if (!value.to) return
        if (!value.amount) return
        if (!value.selection) return

        yield call(
          api.withdrawBSFunds,
          value.to[0].address,
          coin,
          new BigNumber(value.amount[0]).toString(),
          value.selection.fee
        )
      } else {
        const value = payment.value()
        // notify backend of incoming non-custodial deposit
        if (value.to && value.to[0].type === 'CUSTODIAL') {
          yield put(
            actions.components.send.notifyNonCustodialToCustodialTransfer(value, 'SIMPLEBUY')
          )
        }
        payment = yield payment.publish()
      }

      yield put(actions.core.data.btc.fetchData())
      // yield put(A.sendBtcPaymentUpdatedSuccess(payment.value()))
      // Set tx note
      // if (path(['description', 'length'], payment.value())) {
      //   yield put(
      //     actions.core.wallet.setTransactionNote(payment.value().txId, payment.value().description)
      //   )
      // }
      // Redirect to tx list, display success
      // yield put(actions.router.push('/coins/BTC'))
      // yield put(
      //   actions.alerts.displaySuccess(C.SEND_COIN_SUCCESS, {
      //     coinName: 'Bitcoin'
      //   })
      // )

      const amt = payment.value().amount || [0]
      const coinAmount = Exchange.convertCoinToCoin({
        coin,
        value: amt.reduce((a, b) => a + b, 0)
      })

      // triggers email notification to user that
      // non-custodial funds were sent from the wallet
      if (fromType === ADDRESS_TYPES.ACCOUNT) {
        yield put(actions.core.wallet.triggerNonCustodialSendAlert(coin, coinAmount))
      }

      // yield put(destroy(FORM))
    } catch (e) {
      // yield put(stopSubmit(FORM))
      // Set errors
      const error = errorHandler(e)

      if (fromType === ADDRESS_TYPES.CUSTODIAL && error) {
        if (error === 'Pending withdrawal locks') {
          yield call(showWithdrawalLockAlert)
        } else {
          yield put(actions.alerts.displayError(error))
        }
      } else {
        yield put(A.submitTransactionFailure(error))
      }
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

    const formValues = selectors.form.getFormValues(SEND_FORM)(yield select()) as SendFormType
    if (formValues && nonMigratedCoins.includes(formValues?.selectedAccount?.coin)) {
      const { coin } = formValues.selectedAccount
      // TODO add part for checking for change based on coin
    }
  }

  const signTx = function* (prebuildTx: BuildTxResponseType, password: string) {
    const privateKey = yield call(getPrivKey, password)

    if (!privateKey) throw new Error('Could not derive private key')

    const signedTx = prebuildTx
    const signedPreImages = prebuildTx.preImages.map((preImage) => {
      // @ts-ignore
      const { recovery, signature } = secp256k1.sign(
        Buffer.from(preImage.preImage, 'hex'),
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

        // check is selected account with coin in non migrated coins list and process it
        if (nonMigratedCoins.includes(coin)) {
          if (coin === 'BTC') {
            call(submitBTCTransaction)
            return
          }
        }

        const signedTx: BuildTxResponseType = yield call(signTx, prebuildTx, password)
        const pushedTx: ReturnType<typeof api.pushTx> = yield call(
          api.pushTx,
          coin,
          signedTx.rawTx,
          signedTx.preImages,
          {
            guid,
            uuid
          }
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
          yield put(actions.core.data.coins.fetchTransactions(coin, true))
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
