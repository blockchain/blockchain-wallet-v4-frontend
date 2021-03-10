import BigNumber from 'bignumber.js'
import bip21 from 'bip21'
import {
  add,
  equals,
  identity,
  includes,
  isNil,
  nth,
  path,
  pathOr,
  prop
} from 'ramda'
import {
  change,
  destroy,
  initialize,
  startSubmit,
  stopSubmit
} from 'redux-form'
import { call, delay, put, race, select, take } from 'redux-saga/effects'

import { Exchange } from 'blockchain-wallet-v4/src'
import { APIType } from 'blockchain-wallet-v4/src/network/api'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import {
  AddressTypesType,
  BtcAccountFromType,
  BtcFromType,
  BtcPaymentType
} from 'blockchain-wallet-v4/src/types'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { actions, actionTypes, model, selectors } from 'data'
import { ModalNamesType } from 'data/modals/types'
import * as C from 'services/alerts'
import * as Lockbox from 'services/lockbox'
import { promptForSecondPassword } from 'services/sagas'

import sendSagas from '../send/sagas'
import * as A from './actions'
import { FORM } from './model'
import * as S from './selectors'

const DUST = 546
const DUST_BTC = '0.00000546'
const { TRANSACTION_EVENTS } = model.analytics

export const logLocation = 'components/sendBtc/sagas'
export default ({
  api,
  coreSagas,
  networks
}: {
  api: APIType
  coreSagas: any
  networks: any
}) => {
  const { showWithdrawalLockAlert } = sendSagas({
    api,
    coreSagas,
    networks
  })
  const initialized = function * (action) {
    try {
      const {
        amount,
        description,
        feeType,
        from,
        lockboxIndex,
        payPro,
        to
      } = action.payload
      yield put(A.sendBtcPaymentUpdatedLoading())

      yield put(actions.components.send.fetchPaymentsAccountExchange('BTC'))
      let payment = coreSagas.payment.btc.create({
        network: networks.btc
      })
      payment = yield payment.init()
      let defaultAccountR

      if (lockboxIndex && lockboxIndex >= 0) {
        const accountsR = yield select(
          selectors.core.common.btc.getLockboxBtcBalances
        )
        defaultAccountR = accountsR.map(nth(lockboxIndex))
        const xpub = defaultAccountR.map(prop('xpub')).getOrFail()
        payment = yield payment.from(xpub, ADDRESS_TYPES.LOCKBOX)
      } else if (from === 'allImportedAddresses') {
        const addressesR = yield select(
          selectors.core.common.btc.getActiveAddresses
        )
        const addresses = addressesR
          .getOrElse([])
          .filter(prop('priv'))
          .map(prop('addr'))
        payment = yield payment.from(addresses, ADDRESS_TYPES.LEGACY)
      } else {
        const accountsR = yield select(
          selectors.core.common.btc.getAccountsBalances
        )
        const defaultIndex = yield select(
          selectors.core.wallet.getDefaultAccountIndex
        )
        defaultAccountR = accountsR.map(nth(defaultIndex))
        payment = yield payment.from(defaultIndex, ADDRESS_TYPES.ACCOUNT)
        if (to) payment = yield payment.to(to)
        if (amount && amount.coin) {
          const satAmount = Exchange.convertBtcToBtc({
            value: amount.coin,
            fromUnit: 'BTC',
            toUnit: 'SAT'
          }).value
          payment = yield payment.amount(parseInt(satAmount))
        }
        if (description) payment = yield payment.description(description)
      }
      const defaultFeePerByte = payPro
        ? path(['fees', feeType || 'priority'], payment.value())
        : path(['fees', feeType || 'regular'], payment.value())
      payment = yield payment.fee(defaultFeePerByte)
      const prepareTo = to => {
        return to ? { value: { value: to, label: to } } : null
      }
      const initialValues = {
        coin: 'BTC',
        amount,
        description,
        to: prepareTo(to),
        from: from || defaultAccountR.getOrElse(),
        feePerByte: defaultFeePerByte,
        payPro
      }
      if (payPro) {
        try {
          payment = yield payment.build()
        } catch (e) {
          yield put(
            actions.logs.logErrorMessage(logLocation, 'sendBtcInitialized', e)
          )
        }
      }
      yield put(initialize(FORM, initialValues))
      yield put(A.sendBtcPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(A.sendBtcPaymentUpdatedFailure(e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'sendBtcInitialized', e)
      )
    }
  }

  const destroyed = function * () {
    yield put(actions.form.destroy(FORM))
  }

  const bitPayInvoiceEntered = function * (bip21Payload) {
    yield put(
      actions.modals.showModal('Confirm', {
        origin: 'SendBtc',
        title: C.BITPAY_CONFIRM_TITLE,
        message: C.BITPAY_CONFIRM_MSG
      })
    )
    let { canceled } = yield race({
      response: take(actionTypes.wallet.SUBMIT_CONFIRMATION),
      canceled: take(actionTypes.modals.CLOSE_MODAL)
    })
    if (canceled) return
    yield put(actions.modals.closeAllModals())
    yield put(
      actions.goals.saveGoal('paymentProtocol', {
        coin: 'BTC',
        r: pathOr({}, ['options', 'r'], bip21Payload)
      })
    )
    return yield put(actions.goals.runGoals())
  }

  const bitpayInvoiceExpired = function * () {
    yield put(actions.modals.closeAllModals())
    yield put(
      actions.modals.showModal('BitPayInvoiceExpired', { origin: 'SendBtc' })
    )
    yield put(
      actions.analytics.logEvent([
        ...TRANSACTION_EVENTS.BITPAY_FAILURE,
        'invoice expired'
      ])
    )
  }

  const firstStepSubmitClicked = function * () {
    try {
      let p = yield select(S.getPayment)
      yield put(A.sendBtcPaymentUpdatedLoading())
      let payment: BtcPaymentType = coreSagas.payment.btc.create({
        payment: p.getOrElse({}),
        network: networks.btc
      })
      payment = yield payment.build()
      yield put(A.sendBtcPaymentUpdatedSuccess(payment.value()))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'firstStepSubmitClicked', e)
      )
    }
  }

  const formChanged = function * (action) {
    try {
      const form = path(['meta', 'form'], action)
      if (!equals(FORM, form)) return
      const payload = prop('payload', action)
      const field = path(['meta', 'field'], action)
      const erc20List = (yield select(
        selectors.core.walletOptions.getErc20CoinList
      )).getOrFail()
      let p = yield select(S.getPayment)
      let payment: BtcPaymentType = coreSagas.payment.btc.create({
        payment: p.getOrElse({}),
        network: networks.btc
      })

      switch (field) {
        case 'coin':
          const modalName = includes(payload, erc20List) ? 'ETH' : payload
          yield put(actions.modals.closeAllModals())
          yield put(
            actions.modals.showModal(
              `@MODAL.SEND.${modalName}` as ModalNamesType,
              {
                coin: payload,
                origin: 'SendBtc'
              }
            )
          )
          break
        case 'from':
          let payloadT = payload as BtcFromType
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
              payment = yield payment.from(
                payloadT.label,
                fromType,
                payloadT.withdrawable
              )
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
          const value = pathOr(
            payload,
            ['value', 'value'],
            payload
          ) as BtcFromType
          // @ts-ignore
          const toType = prop('type', value)
          // @ts-ignore
          const address = prop('address', value) || value
          let payProInvoice
          const tryParsePayPro = () => {
            try {
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
              break
            case equals(toType, ADDRESS_TYPES.LOCKBOX):
              // @ts-ignore
              payment = yield payment.to(value.xpub, toType)
              break
            case !isNil(tryParsePayPro()):
              yield call(bitPayInvoiceEntered, payProInvoice)
              break
            default:
              payment = yield payment.to(address, toType)
          }
          break
        case 'amount':
          const btcAmount = prop('coin', payload)
          const satAmount = Exchange.convertBtcToBtc({
            value: btcAmount,
            fromUnit: 'BTC',
            toUnit: 'SAT'
          }).value
          payment = yield payment.amount(parseInt(satAmount))
          break
        case 'description':
          payment = yield payment.description(payload)
          break
        case 'feePerByte':
          payment = yield payment.fee(parseInt(payload))
          break
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

  const minimumAmountClicked = function * () {
    try {
      const appState = yield select(identity)
      const currency = selectors.core.settings
        .getCurrency(appState)
        .getOrFail('Can not retrieve currency.')
      const btcRates = selectors.core.data.btc
        .getRates(appState)
        .getOrFail('Can not retrieve bitcoin rates.')
      const coin = DUST_BTC
      const fiat = Exchange.convertBtcToFiat({
        value: DUST,
        fromUnit: 'SAT',
        toCurrency: currency,
        rates: btcRates
      }).value
      yield put(change(FORM, 'amount', { coin, fiat }))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'minimumAmountClicked', e)
      )
    }
  }

  const maximumAmountClicked = function * () {
    try {
      const appState = yield select(identity)
      const currency = selectors.core.settings
        .getCurrency(appState)
        .getOrFail('Can not retrieve currency.')
      const btcRates = selectors.core.data.btc
        .getRates(appState)
        .getOrFail('Can not retrieve bitcoin rates.')
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const effectiveBalance = prop('effectiveBalance', payment)
      const coin = Exchange.convertBtcToBtc({
        value: effectiveBalance,
        fromUnit: 'SAT',
        toUnit: 'BTC'
      }).value
      const fiat = Exchange.convertBtcToFiat({
        value: effectiveBalance,
        fromUnit: 'SAT',
        toCurrency: currency,
        rates: btcRates
      }).value
      yield put(change(FORM, 'amount', { coin, fiat }))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'maximumAmountClicked', e)
      )
    }
  }

  const minimumFeeClicked = function * () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const minFeePerByte = path(['fees', 'limits', 'min'], payment)
      yield put(change(FORM, 'feePerByte', minFeePerByte))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'minimumFeeClicked', e)
      )
    }
  }

  const maximumFeeClicked = function * () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const maxFeePerByte = path(['fees', 'limits', 'max'], payment)
      yield put(change(FORM, 'feePerByte', maxFeePerByte))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'maximumFeeClicked', e)
      )
    }
  }

  const regularFeeClicked = function * () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const regularFeePerByte = path(['fees', 'regular'], payment)
      yield put(change(FORM, 'feePerByte', regularFeePerByte))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'regularFeeClicked', e)
      )
    }
  }

  const priorityFeeClicked = function * () {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const priorityFeePerByte = path(['fees', 'priority'], payment)
      yield put(change(FORM, 'feePerByte', priorityFeePerByte))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'priorityFeeClicked', e)
      )
    }
  }

  const secondStepSubmitClicked = function * () {
    yield put(startSubmit(FORM))
    let p = yield select(S.getPayment)
    let payment: BtcPaymentType = coreSagas.payment.btc.create({
      payment: p.getOrElse({}),
      network: networks.btc
    })
    const fromType: AddressTypesType | undefined = path(
      ['fromType'],
      payment.value()
    )
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
        const outputs = selection.outputs
          .filter(o => !o.change)
          .map(prop('address'))
        yield call(Lockbox.promptForLockbox, 'BTC', deviceType, outputs)
        let connection = yield select(
          selectors.components.lockbox.getCurrentConnection
        )
        const transport = prop('transport', connection)
        const scrambleKey = Lockbox.utils.getScrambleKey('BTC', deviceType)
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
          'BTC'
        )
        yield delay(3000)
        yield call(
          // @ts-ignore
          api.submitPaymentRequest,
          invoiceId,
          txHex,
          weightedSize,
          'BTC'
        )
      } else if (fromType === ADDRESS_TYPES.CUSTODIAL) {
        const value = payment.value()
        if (!value.to) return
        if (!value.amount) return
        yield call(
          api.withdrawSBFunds,
          value.to[0].address,
          'BTC',
          new BigNumber(value.amount[0]).toString()
        )
      } else {
        const value = payment.value()
        // notify backend of incoming non-custodial deposit
        if (value.to && value.to[0].type === 'CUSTODIAL') {
          yield put(
            actions.components.send.notifyNonCustodialToCustodialTransfer(
              value,
              'SIMPLEBUY'
            )
          )
        }
        payment = yield payment.publish()
      }

      yield put(actions.core.data.btc.fetchData())
      yield put(A.sendBtcPaymentUpdatedSuccess(payment.value()))
      // Set tx note
      if (path(['description', 'length'], payment.value())) {
        yield put(
          actions.core.wallet.setTransactionNote(
            payment.value().txId,
            payment.value().description
          )
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

      yield put(
        actions.analytics.logEvent([
          ...TRANSACTION_EVENTS.SEND,
          'BTC',
          Exchange.convertCoinToCoin({
            value: amt.reduce(add, 0),
            coin: 'BTC',
            baseToStandard: true
          }).value
        ])
      )
      if (payPro) {
        const coinAmount = Exchange.convertCoinToCoin({
          value: amt.reduce(add, 0),
          coin: 'BTC',
          baseToStandard: true
        }).value
        yield put(
          actions.analytics.logEvent([
            ...TRANSACTION_EVENTS.BITPAY_SUCCESS,
            `${coinAmount} BTC`
          ])
        )
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
        yield put(
          actions.logs.logErrorMessage(
            logLocation,
            'secondStepSubmitClicked',
            e
          )
        )
        yield put(
          actions.analytics.logEvent([
            ...TRANSACTION_EVENTS.SEND_FAILURE,
            'BTC',
            e
          ])
        )
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
        if (payPro) {
          yield put(
            actions.analytics.logEvent([
              ...TRANSACTION_EVENTS.BITPAY_FAILURE,
              e
            ])
          )
        }
      }
    }
  }

  return {
    bitpayInvoiceExpired,
    initialized,
    destroyed,
    minimumAmountClicked,
    maximumAmountClicked,
    minimumFeeClicked,
    maximumFeeClicked,
    regularFeeClicked,
    priorityFeeClicked,
    firstStepSubmitClicked,
    secondStepSubmitClicked,
    formChanged
  }
}
