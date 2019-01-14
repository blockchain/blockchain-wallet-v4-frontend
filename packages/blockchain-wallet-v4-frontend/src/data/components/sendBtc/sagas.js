import { equals, path, prop, nth, is, identity } from 'ramda'
import { call, select, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as A from './actions'
import * as S from './selectors'
import { FORM, ANALYTICS } from './model'
import { actions, model, selectors } from 'data'
import {
  initialize,
  change,
  startSubmit,
  stopSubmit,
  destroy
} from 'redux-form'
import * as C from 'services/AlertService'
import { promptForSecondPassword, promptForLockbox } from 'services/SagaService'
import * as Lockbox from 'services/LockboxService'
import { Exchange } from 'blockchain-wallet-v4/src'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'

const DUST = 546
const DUST_BTC = '0.00000546'
export const logLocation = 'components/sendBtc/sagas'
const { SEND_BTC } = ANALYTICS

export default ({ coreSagas, networks }) => {
  const initialized = function*(action) {
    try {
      const {
        from,
        to,
        amount,
        feeType,
        description,
        lockboxIndex
      } = action.payload
      yield put(A.sendBtcPaymentUpdatedLoading())
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
      }
      const defaultFeePerByte = path(
        ['fees', feeType || 'regular'],
        payment.value()
      )
      payment = yield payment.fee(defaultFeePerByte)
      const initialValues = {
        to,
        coin: 'BTC',
        amount,
        description,
        from: from || defaultAccountR.getOrElse(),
        feePerByte: defaultFeePerByte
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

  const destroyed = function*() {
    yield put(actions.form.destroy(FORM))
  }

  const firstStepSubmitClicked = function*() {
    try {
      let p = yield select(S.getPayment)
      yield put(A.sendBtcPaymentUpdatedLoading())
      let payment = coreSagas.payment.btc.create({
        payment: p.getOrElse({}),
        network: networks.btc
      })
      payment = yield payment.build()
      yield put(A.sendBtcPaymentUpdatedSuccess(payment.value()))
      yield put(
        actions.analytics.logEvent([SEND_BTC, 'click', 'first_step_submit'])
      )
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'firstStepSubmitClicked', e)
      )
    }
  }

  const formChanged = function*(action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      const payload = prop('payload', action)
      if (!equals(FORM, form)) return

      let p = yield select(S.getPayment)
      let payment = coreSagas.payment.btc.create({
        payment: p.getOrElse({}),
        network: networks.btc
      })

      switch (field) {
        case 'coin':
          switch (payload) {
            case 'ETH': {
              yield put(actions.modals.closeAllModals())
              yield put(
                actions.modals.showModal(model.components.sendEth.MODAL)
              )
              break
            }
            case 'BCH': {
              yield put(actions.modals.closeAllModals())
              yield put(
                actions.modals.showModal(model.components.sendBch.MODAL)
              )
              break
            }
            case 'XLM': {
              yield put(actions.modals.closeAllModals())
              yield put(
                actions.modals.showModal(model.components.sendXlm.MODAL)
              )
              break
            }
          }
          break
        case 'from':
          yield put(actions.analytics.logEvent([SEND_BTC, 'click', 'from']))
          const fromType = prop('type', payload)
          if (is(String, payload)) {
            yield payment.from(payload, fromType)
            break
          }
          switch (fromType) {
            case ADDRESS_TYPES.ACCOUNT:
              payment = yield payment.from(payload.index, fromType)
              break
            case ADDRESS_TYPES.LOCKBOX:
              payment = yield payment.from(payload.xpub, fromType)
              break
            default:
              if (!payload.watchOnly) {
                payment = yield payment.from(payload.address, fromType)
              }
          }
          break
        case 'priv':
          // Payload is the private key entered by the user
          payment = yield payment.from(payload)
          break
        case 'to':
          const toType = prop('type', payload)
          switch (toType) {
            case ADDRESS_TYPES.ACCOUNT:
              payment = yield payment.to(payload.index, toType)
              break
            case ADDRESS_TYPES.LOCKBOX:
              payment = yield payment.to(payload.xpub, toType)
              break
            default:
              const address = prop('address', payload) || payload
              payment = yield payment.to(address, toType)
          }
          break
        case 'amount':
          const btcAmount = prop('coin', payload)
          const satAmount = Exchange.convertBitcoinToBitcoin({
            value: btcAmount,
            fromUnit: 'BTC',
            toUnit: 'SAT'
          }).value
          payment = yield payment.amount(parseInt(satAmount))
          break
        case 'description':
          yield put(
            actions.analytics.logEvent([SEND_BTC, 'change', 'description'])
          )
          payment = yield payment.description(payload)
          break
        case 'feePerByte':
          yield put(
            actions.analytics.logEvent([SEND_BTC, 'change', 'feePerByte'])
          )
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

  const toToggled = function*() {
    try {
      yield put(change(FORM, 'to', ''))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'toToggled', e))
    }
  }

  const minimumAmountClicked = function*() {
    try {
      const appState = yield select(identity)
      const currency = selectors.core.settings
        .getCurrency(appState)
        .getOrFail('Can not retrieve currency.')
      const btcRates = selectors.core.data.bitcoin
        .getRates(appState)
        .getOrFail('Can not retrieve bitcoin rates.')
      const coin = DUST_BTC
      const fiat = Exchange.convertBitcoinToFiat({
        value: DUST,
        fromUnit: 'SAT',
        toCurrency: currency,
        rates: btcRates
      }).value
      yield put(change(FORM, 'amount', { coin, fiat }))
      yield put(actions.analytics.logEvent([SEND_BTC, 'click', 'min_amount']))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'minimumAmountClicked', e)
      )
    }
  }

  const maximumAmountClicked = function*() {
    try {
      const appState = yield select(identity)
      const currency = selectors.core.settings
        .getCurrency(appState)
        .getOrFail('Can not retrieve currency.')
      const btcRates = selectors.core.data.bitcoin
        .getRates(appState)
        .getOrFail('Can not retrieve bitcoin rates.')
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const effectiveBalance = prop('effectiveBalance', payment)
      const coin = Exchange.convertBitcoinToBitcoin({
        value: effectiveBalance,
        fromUnit: 'SAT',
        toUnit: 'BTC'
      }).value
      const fiat = Exchange.convertBitcoinToFiat({
        value: effectiveBalance,
        fromUnit: 'SAT',
        toCurrency: currency,
        rates: btcRates
      }).value
      yield put(change(FORM, 'amount', { coin, fiat }))
      yield put(actions.analytics.logEvent([SEND_BTC, 'click', 'max_amount']))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'maximumAmountClicked', e)
      )
    }
  }

  const minimumFeeClicked = function*() {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const minFeePerByte = path(['fees', 'limits', 'min'], payment)
      yield put(change(FORM, 'feePerByte', minFeePerByte))
      yield put(actions.analytics.logEvent([SEND_BTC, 'click', 'min_fee']))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'minimumFeeClicked', e)
      )
    }
  }

  const maximumFeeClicked = function*() {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const maxFeePerByte = path(['fees', 'limits', 'max'], payment)
      yield put(change(FORM, 'feePerByte', maxFeePerByte))
      yield put(actions.analytics.logEvent([SEND_BTC, 'click', 'max_fee']))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'maximumFeeClicked', e)
      )
    }
  }

  const regularFeeClicked = function*() {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const regularFeePerByte = path(['fees', 'regular'], payment)
      yield put(change(FORM, 'feePerByte', regularFeePerByte))
      yield put(actions.analytics.logEvent([SEND_BTC, 'click', 'regular_fee']))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'regularFeeClicked', e)
      )
    }
  }

  const priorityFeeClicked = function*() {
    try {
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const priorityFeePerByte = path(['fees', 'priority'], payment)
      yield put(change(FORM, 'feePerByte', priorityFeePerByte))
      yield put(actions.analytics.logEvent([SEND_BTC, 'click', 'priority_fee']))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'priorityFeeClicked', e)
      )
    }
  }

  const secondStepSubmitClicked = function*() {
    yield put(startSubmit(FORM))
    let p = yield select(S.getPayment)
    let payment = coreSagas.payment.btc.create({
      payment: p.getOrElse({}),
      network: networks.btc
    })
    const fromType = path(['fromType'], payment.value())
    try {
      // Sign payment
      let password
      if (fromType !== ADDRESS_TYPES.LOCKBOX) {
        if (fromType !== ADDRESS_TYPES.WATCH_ONLY) {
          password = yield call(promptForSecondPassword)
        }
        payment = yield payment.sign(password)
      } else {
        const deviceR = yield select(
          selectors.core.kvStore.lockbox.getDeviceFromBtcXpubs,
          prop('from', p.getOrElse({}))
        )
        const device = deviceR.getOrFail('missing_device')
        const deviceType = prop('device_type', device)
        const outputs = path(['selection', 'outputs'], payment.value())
          .filter(o => !o.change)
          .map(prop('address'))
        yield call(promptForLockbox, 'BTC', deviceType, outputs)
        let connection = yield select(
          selectors.components.lockbox.getCurrentConnection
        )
        const transport = prop('transport', connection)
        const scrambleKey = Lockbox.utils.getScrambleKey('BTC', deviceType)
        payment = yield payment.sign(null, transport, scrambleKey)
      }
      // Publish payment
      payment = yield payment.publish()
      yield put(actions.core.data.bitcoin.fetchData())
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
        yield put(actions.alerts.displaySuccess(C.SEND_BTC_SUCCESS))
      }
      yield put(destroy(FORM))
      // Close modals
      yield put(actions.modals.closeAllModals())
      yield put(
        actions.analytics.logEvent([SEND_BTC, 'click', 'second_step_submit'])
      )
    } catch (e) {
      yield put(stopSubmit(FORM))
      // Set errors
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
        yield put(actions.alerts.displayError(C.SEND_BTC_ERROR))
        yield put(actions.modals.closeAllModals())
      }
    }
  }

  return {
    initialized,
    destroyed,
    toToggled,
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
