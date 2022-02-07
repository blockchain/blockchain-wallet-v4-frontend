import BigNumber from 'bignumber.js'
import bip21 from 'bip21'
import { add, equals, identity, includes, isNil, nth, path, pathOr, prop } from 'ramda'
import { change, destroy, initialize, startSubmit, stopSubmit } from 'redux-form'
import { call, delay, put, race, select, take } from 'redux-saga/effects'

import { Exchange } from '@core'
import { APIType } from '@core/network/api'
import { ADDRESS_TYPES } from '@core/redux/payment/btc/utils'
import {
  AddressTypesType,
  BtcAccountFromType,
  BtcFromType,
  BtcPaymentType,
  WalletAccountEnum
} from '@core/types'
import { errorHandler } from '@core/utils'
import { actions, actionTypes, selectors } from 'data'
import * as C from 'services/alerts'
import * as Lockbox from 'services/lockbox'
import { promptForSecondPassword } from 'services/sagas'

import sendSagas from '../send/sagas'
import * as A from './actions'
import { FORM } from './model'
import * as S from './selectors'

const DUST = 546
const DUST_BTC = '0.00000546'
const coin = 'BTC'

export const logLocation = 'components/sendBtc/sagas'
export default ({ api, coreSagas, networks }: { api: APIType; coreSagas: any; networks: any }) => {
  const { showWithdrawalLockAlert } = sendSagas({
    api,
    coreSagas,
    networks
  })
  const initialized = function* (action) {
    try {
      const { amount, description, feeType, from, lockboxIndex, payPro, to } = action.payload
      yield put(A.sendBtcPaymentUpdatedLoading())

      yield put(actions.components.send.fetchPaymentsAccountExchange(coin))
      let payment = coreSagas.payment.btc.create({
        network: networks.btc
      })
      payment = yield payment.init()
      let defaultAccountR

      if (lockboxIndex && lockboxIndex >= 0) {
        const accountsR = yield select(selectors.core.common.btc.getLockboxBtcBalances)
        defaultAccountR = accountsR.map(nth(lockboxIndex))
        const xpub = defaultAccountR.map(prop('xpub')).getOrFail()
        payment = yield payment.from(xpub, ADDRESS_TYPES.LOCKBOX)
      } else if (from === 'allImportedAddresses') {
        const addressesR = yield select(selectors.core.common.btc.getActiveAddresses)
        const addresses = addressesR.getOrElse([]).filter(prop('priv')).map(prop('addr'))
        payment = yield payment.from(addresses, ADDRESS_TYPES.LEGACY)
      } else {
        const accountsR = yield select(selectors.core.common.btc.getAccountsBalances)
        const defaultIndex = yield select(selectors.core.wallet.getDefaultAccountIndex)
        defaultAccountR = accountsR.map(nth(defaultIndex))
        payment = yield payment.from(defaultIndex, ADDRESS_TYPES.ACCOUNT)
        if (to) payment = yield payment.to(to)
        if (amount && amount.coin) {
          const satAmount = Exchange.convertCoinToCoin({
            baseToStandard: false,
            coin,
            value: amount.coin
          })
          payment = yield payment.amount(parseInt(satAmount))
        }
        if (description) payment = yield payment.description(description)
      }
      const defaultFeePerByte = payPro
        ? path(['fees', feeType || 'priority'], payment.value())
        : path(['fees', feeType || 'regular'], payment.value())
      payment = yield payment.fee(defaultFeePerByte)
      const prepareTo = (to) => {
        return to ? { value: { label: to, value: to } } : null
      }
      const initialValues = {
        amount,
        coin,
        description,
        feePerByte: defaultFeePerByte,
        from: from || defaultAccountR.getOrElse(),
        payPro,
        to: prepareTo(to)
      }
      if (payPro) {
        try {
          payment = yield payment.build()
        } catch (e) {
          yield put(actions.logs.logErrorMessage(logLocation, 'sendBtcInitialized', e))
        }
      }
      yield put(initialize(FORM, initialValues))
      yield put(A.sendBtcPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(A.sendBtcPaymentUpdatedFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'sendBtcInitialized', e))
    }
  }

  const destroyed = function* () {
    yield put(actions.form.destroy(FORM))
  }

  const bitPayInvoiceEntered = function* (bip21Payload) {
    yield put(
      actions.modals.showModal('CONFIRMATION_MODAL', {
        message: C.BITPAY_CONFIRM_MSG,
        origin: 'SendBtc',
        title: C.BITPAY_CONFIRM_TITLE
      })
    )
    const { canceled } = yield race({
      canceled: take(actionTypes.modals.CLOSE_MODAL),
      response: take(actionTypes.wallet.SUBMIT_CONFIRMATION)
    })
    if (canceled) return
    yield put(actions.modals.closeAllModals())
    yield put(
      actions.goals.saveGoal({
        data: {
          coin,
          r: pathOr({}, ['options', 'r'], bip21Payload)
        },
        name: 'paymentProtocol'
      })
    )
    return yield put(actions.goals.runGoals())
  }

  const bitpayInvoiceExpired = function* () {
    yield put(actions.modals.closeAllModals())
    yield put(
      actions.modals.showModal('BITPAY_INVOICE_EXPIRED_MODAL', {
        origin: 'SendBtc'
      })
    )
  }

  const firstStepSubmitClicked = function* () {
    try {
      const p = yield select(S.getPayment)
      yield put(A.sendBtcPaymentUpdatedLoading())
      let payment: BtcPaymentType = coreSagas.payment.btc.create({
        network: networks.btc,
        payment: p.getOrElse({})
      })
      payment = yield payment.build()
      yield put(A.sendBtcPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'firstStepSubmitClicked', e))
    }
  }

  const formChanged = function* (action) {
    try {
      const form = path(['meta', 'form'], action)
      if (!equals(FORM, form)) return
      const payload = prop('payload', action)
      const field = path(['meta', 'field'], action)
      const p = yield select(S.getPayment)
      let payment: BtcPaymentType = coreSagas.payment.btc.create({
        network: networks.btc,
        payment: p.getOrElse({})
      })

      switch (field) {
        case 'from':
          const payloadT = payload as BtcFromType
          const fromType = payloadT.type as AddressTypesType
          if (typeof payloadT === 'string') {
            yield payment.from(payloadT, fromType)
            break
          }
          switch (payloadT.type) {
            case 'ACCOUNT':
              payment = yield payment.from(payloadT.index, fromType)
              break
            case 'LOCKBOX':
              payment = yield payment.from(payloadT.xpub, fromType)
              break
            case 'CUSTODIAL':
              const response: ReturnType<typeof api.getWithdrawalFees> = yield call(
                api.getWithdrawalFees,
                'simplebuy',
                'DEFAULT'
              )
              const fee = response.fees.find(({ symbol }) => symbol === coin)?.minorValue || '0'
              payment = yield payment.from(
                payloadT.label,
                fromType,
                new BigNumber(payloadT.withdrawable).minus(fee).toString()
              )
              payment = yield payment.fee(new BigNumber(fee).toNumber())
              yield put(A.sendBtcPaymentUpdatedSuccess(payment.value()))
              yield put(change(FORM, 'to', null))
              break
            default:
              payment = yield payment.from(payloadT.address, fromType)
              break
          }
          break
        case 'priv':
          // Payload is the private key entered by the user
          payment = yield payment.from(payload)
          break
        case 'to':
          const value = pathOr(payload, ['value', 'value'], payload) as BtcFromType
          // @ts-ignore
          const toType = prop('type', value)
          // @ts-ignore
          const address = (prop('address', value) || value) as string
          let payProInvoice
          const tryParsePayPro = () => {
            try {
              if (address.indexOf('?') === -1) throw new Error('Not bitpay')
              payProInvoice = bip21.decode(address)
              return payProInvoice
            } catch (e) {
              return null
            }
          }
          switch (true) {
            case equals(toType, ADDRESS_TYPES.ACCOUNT):
              const accountValue = value as BtcAccountFromType
              payment = yield payment.to(accountValue.index, toType)
              // seamless limits logic
              const { from } = yield select(selectors.form.getFormValues(FORM))
              if (toType === ADDRESS_TYPES.ACCOUNT && from.type === ADDRESS_TYPES.CUSTODIAL) {
                const appState = yield select(identity)
                const currency = selectors.core.settings
                  .getCurrency(appState)
                  .getOrFail('Failed to get currency')
                yield put(
                  A.sendBtcFetchLimits(
                    coin,
                    WalletAccountEnum.CUSTODIAL,
                    coin,
                    WalletAccountEnum.NON_CUSTODIAL,
                    currency
                  )
                )
              }
              break
            case equals(toType, ADDRESS_TYPES.LOCKBOX):
              // @ts-ignore
              payment = yield payment.to(value.xpub, toType)
              break
            case includes('.', address as unknown as string) &&
              !includes('bitpay', address as unknown as string):
              yield put(
                actions.components.send.fetchUnstoppableDomainResults(
                  address as unknown as string,
                  coin
                )
              )
              break
            case !isNil(tryParsePayPro()):
              yield call(bitPayInvoiceEntered, payProInvoice)
              break
            default:
              payment = yield payment.to(address as unknown as string, toType)
          }
          break
        case 'amount':
          const btcAmount = prop('coin', payload)
          const satAmount = Exchange.convertCoinToCoin({
            baseToStandard: false,
            coin,
            value: btcAmount
          })
          payment = yield payment.amount(parseInt(satAmount))
          break
        case 'description':
          payment = yield payment.description(payload)
          break
        case 'feePerByte':
          payment = yield payment.fee(parseInt(payload))
          break
        default:
      }
      try {
        payment = yield payment.build()
      } catch (e) {
        yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
      }
      yield put(A.sendBtcPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
    }
  }

  const minimumAmountClicked = function* () {
    try {
      const appState = yield select(identity)
      const currency = selectors.core.settings
        .getCurrency(appState)
        .getOrFail('Can not retrieve currency.')
      const btcRates = selectors.core.data.coins
        .getRates('BTC', appState)
        .getOrFail('Can not retrieve bitcoin rates.')
      const fiat = Exchange.convertCoinToFiat({
        coin,
        currency,
        rates: btcRates,
        value: DUST
      })
      yield put(change(FORM, 'amount', { coin: DUST_BTC, fiat }))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'minimumAmountClicked', e))
    }
  }

  const maximumAmountClicked = function* () {
    try {
      const appState = yield select(identity)
      const currency = selectors.core.settings
        .getCurrency(appState)
        .getOrFail('Can not retrieve currency.')
      const btcRates = selectors.core.data.coins
        .getRates('BTC', appState)
        .getOrFail('Can not retrieve bitcoin rates.')
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const effectiveBalance = prop('effectiveBalance', payment)
      const coinAmount = Exchange.convertCoinToCoin({
        coin,
        value: effectiveBalance
      })
      const fiat = Exchange.convertCoinToFiat({
        coin,
        currency,
        rates: btcRates,
        value: effectiveBalance
      })
      yield put(change(FORM, 'amount', { coin: coinAmount, fiat }))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'maximumAmountClicked', e))
    }
  }

  const minimumFeeClicked = function* () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const minFeePerByte = path(['fees', 'limits', 'min'], payment)
      yield put(change(FORM, 'feePerByte', minFeePerByte))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'minimumFeeClicked', e))
    }
  }

  const maximumFeeClicked = function* () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const maxFeePerByte = path(['fees', 'limits', 'max'], payment)
      yield put(change(FORM, 'feePerByte', maxFeePerByte))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'maximumFeeClicked', e))
    }
  }

  const regularFeeClicked = function* () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const regularFeePerByte = path(['fees', 'regular'], payment)
      yield put(change(FORM, 'feePerByte', regularFeePerByte))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'regularFeeClicked', e))
    }
  }

  const priorityFeeClicked = function* () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const priorityFeePerByte = path(['fees', 'priority'], payment)
      yield put(change(FORM, 'feePerByte', priorityFeePerByte))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'priorityFeeClicked', e))
    }
  }

  const secondStepSubmitClicked = function* () {
    yield put(startSubmit(FORM))
    const p = yield select(S.getPayment)
    let payment: BtcPaymentType = coreSagas.payment.btc.create({
      network: networks.btc,
      payment: p.getOrElse({})
    })
    const fromType: AddressTypesType | undefined = path(['fromType'], payment.value())
    const { payPro } = yield select(selectors.form.getFormValues(FORM))
    try {
      // Sign payment
      let password
      if (fromType !== ADDRESS_TYPES.LOCKBOX) {
        if (fromType !== ADDRESS_TYPES.WATCH_ONLY) {
          password = yield call(promptForSecondPassword)
        }
        if (fromType !== ADDRESS_TYPES.CUSTODIAL) {
          payment = yield payment.sign(password)
        }
      } else {
        const deviceR = yield select(
          selectors.core.kvStore.lockbox.getDeviceFromBtcXpubs,
          prop('from', p.getOrElse({}))
        )
        const device = deviceR.getOrFail('missing_device')
        const deviceType = prop('device_type', device)
        const selection = payment.value().selection || { outputs: [] }
        const outputs = selection.outputs.filter((o) => !o.change).map(prop('address'))
        yield call(Lockbox.promptForLockbox, coin, deviceType, outputs)
        const connection = yield select(selectors.components.lockbox.getCurrentConnection)
        const transport = prop('transport', connection)
        const scrambleKey = Lockbox.utils.getScrambleKey(coin, deviceType)
        // @ts-ignore
        payment = yield payment.sign(null, transport, scrambleKey)
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
      yield put(A.sendBtcPaymentUpdatedSuccess(payment.value()))
      // Set tx note
      if (path(['description', 'length'], payment.value())) {
        yield put(
          actions.core.wallet.setTransactionNote(payment.value().txId, payment.value().description)
        )
      }
      // Redirect to tx list, display success
      if (fromType === ADDRESS_TYPES.LOCKBOX) {
        yield put(actions.components.lockbox.setConnectionSuccess())
        yield delay(4000)
        const fromXPubs = path(['from'], payment.value())
        const device = (yield select(
          selectors.core.kvStore.lockbox.getDeviceFromBtcXpubs,
          fromXPubs
        )).getOrFail('missing_device')
        const deviceIndex = prop('device_index', device)
        yield put(actions.router.push(`/lockbox/dashboard/${deviceIndex}`))
      } else {
        yield put(actions.router.push('/btc/transactions'))
        yield put(
          actions.alerts.displaySuccess(C.SEND_COIN_SUCCESS, {
            coinName: 'Bitcoin'
          })
        )
      }

      const amt = payment.value().amount || [0]
      const coinAmount = Exchange.convertCoinToCoin({
        coin,
        value: amt.reduce(add, 0)
      })

      // triggers email notification to user that
      // non-custodial funds were sent from the wallet
      if (fromType === ADDRESS_TYPES.ACCOUNT) {
        yield put(actions.core.wallet.triggerNonCustodialSendAlert(coin, coinAmount))
      }
      yield put(actions.modals.closeAllModals())
      yield put(destroy(FORM))
    } catch (e) {
      yield put(stopSubmit(FORM))
      // Set errors
      const error = errorHandler(e)
      if (fromType === ADDRESS_TYPES.LOCKBOX) {
        yield put(actions.components.lockbox.setConnectionError(e))
      } else {
        yield put(actions.logs.logErrorMessage(logLocation, 'secondStepSubmitClicked', e))
        if (fromType === ADDRESS_TYPES.CUSTODIAL && error) {
          if (error === 'Pending withdrawal locks') {
            yield call(showWithdrawalLockAlert)
          } else {
            yield put(actions.alerts.displayError(error))
          }
        } else {
          yield put(
            actions.alerts.displayError(C.SEND_COIN_ERROR, {
              coinName: 'Bitcoin'
            })
          )
        }
      }
    }
  }

  const fetchSendLimits = function* ({ payload }: ReturnType<typeof A.sendBtcFetchLimits>) {
    const { currency, fromAccount, inputCurrency, outputCurrency, toAccount } = payload
    try {
      yield put(A.sendBtcFetchLimitsLoading())
      const limitsResponse: ReturnType<typeof api.getCrossBorderTransactions> = yield call(
        api.getCrossBorderTransactions,
        inputCurrency,
        fromAccount,
        outputCurrency,
        toAccount,
        currency
      )
      yield put(A.sendBtcFetchLimitsSuccess(limitsResponse))
    } catch (e) {
      yield put(A.sendBtcFetchLimitsFailure(e))
    }
  }

  return {
    bitpayInvoiceExpired,
    destroyed,
    fetchSendLimits,
    firstStepSubmitClicked,
    formChanged,
    initialized,
    maximumAmountClicked,
    maximumFeeClicked,
    minimumAmountClicked,
    minimumFeeClicked,
    priorityFeeClicked,
    regularFeeClicked,
    secondStepSubmitClicked
  }
}
