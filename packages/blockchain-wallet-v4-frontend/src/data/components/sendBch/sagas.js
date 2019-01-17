import { call, select, put } from 'redux-saga/effects'
import { equals, path, prop, nth, is, identity } from 'ramda'
import { delay } from 'redux-saga'
import * as A from './actions'
import * as S from './selectors'
import { FORM } from './model'
import { actions, model, selectors } from 'data'
import {
  initialize,
  change,
  startSubmit,
  stopSubmit,
  destroy
} from 'redux-form'
import * as C from 'services/AlertService'
import * as Lockbox from 'services/LockboxService'
import { promptForSecondPassword, promptForLockbox } from 'services/SagaService'
import { Exchange, Remote, utils } from 'blockchain-wallet-v4/src'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'

export const logLocation = 'components/sendBch/sagas'
// TODO: Check how to retrieve Bitcoin cash default fee
export const bchDefaultFee = 4

export default ({ coreSagas, networks }) => {
  const initialized = function*(action) {
    try {
      const { from } = action.payload
      yield put(A.sendBchPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.bch.create({
        network: networks.bch
      })
      payment = yield payment.init()
      const accountsR = yield select(
        selectors.core.common.bch.getAccountsBalances
      )
      const defaultIndexR = yield select(
        selectors.core.kvStore.bch.getDefaultAccountIndex
      )
      const defaultIndex = defaultIndexR.getOrElse(0)
      const defaultAccountR = accountsR.map(nth(defaultIndex))
      if (from === 'allImportedAddresses') {
        const addressesR = yield select(
          selectors.core.common.bch.getActiveAddresses
        )
        const addresses = addressesR
          .getOrElse([])
          .filter(prop('priv'))
          .map(prop('addr'))
          .map(utils.bch.fromCashAddr)
        payment = yield payment.from(addresses, ADDRESS_TYPES.LEGACY)
      } else {
        payment = yield payment.from(defaultIndex, ADDRESS_TYPES.ACCOUNT)
      }
      payment = yield payment.fee(bchDefaultFee)
      const initialValues = {
        coin: 'BCH',
        from: from || defaultAccountR.getOrElse()
      }
      yield put(initialize(FORM, initialValues))
      yield put(A.sendBchPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'sendBchInitialized', e)
      )
    }
  }

  const destroyed = function*() {
    yield put(actions.form.destroy(FORM))
  }

  const firstStepSubmitClicked = function*() {
    try {
      let p = yield select(S.getPayment)
      yield put(A.sendBchPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.bch.create({
        payment: p.getOrElse({}),
        network: networks.bch
      })
      payment = yield payment.build()
      yield put(A.sendBchPaymentUpdated(Remote.of(payment.value())))
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
      let payment = coreSagas.payment.bch.create({
        payment: p.getOrElse({}),
        network: networks.bch
      })

      switch (field) {
        case 'coin':
          switch (payload) {
            case 'BTC': {
              yield put(actions.modals.closeAllModals())
              yield put(
                actions.modals.showModal(model.components.sendBtc.MODAL)
              )
              break
            }
            case 'ETH': {
              yield put(actions.modals.closeAllModals())
              yield put(
                actions.modals.showModal(model.components.sendEth.MODAL)
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
              payment = yield payment.from(payload.address, fromType)
          }
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
          const bchAmount = prop('coin', payload)
          const satAmount = Exchange.convertBchToBch({
            value: bchAmount,
            fromUnit: 'BCH',
            toUnit: 'SAT'
          }).value
          payment = yield payment.amount(parseInt(satAmount))
          break
        case 'description':
          payment = yield payment.description(payload)
          break
      }
      try {
        payment = yield payment.build()
      } catch (e) {}
      yield put(A.sendBchPaymentUpdated(Remote.of(payment.value())))
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

  const maximumAmountClicked = function*() {
    try {
      const appState = yield select(identity)
      const currency = selectors.core.settings
        .getCurrency(appState)
        .getOrFail('Can not retrieve currency.')
      const bchRates = selectors.core.data.bch
        .getRates(appState)
        .getOrFail('Can not retrieve bitcoin cash rates.')
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const effectiveBalance = prop('effectiveBalance', payment)
      const coin = Exchange.convertBchToBch({
        value: effectiveBalance,
        fromUnit: 'SAT',
        toUnit: 'BCH'
      }).value
      const fiat = Exchange.convertBchToFiat({
        value: effectiveBalance,
        fromUnit: 'SAT',
        toCurrency: currency,
        rates: bchRates
      }).value
      yield put(change(FORM, 'amount', { coin, fiat }))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'maximumAmountClicked', e)
      )
    }
  }

  const secondStepSubmitClicked = function*() {
    yield put(startSubmit(FORM))
    let p = yield select(S.getPayment)
    let payment = coreSagas.payment.bch.create({
      payment: p.getOrElse({}),
      network: networks.bch
    })
    const fromType = path(['fromType'], payment.value())
    try {
      // Sign payment
      if (fromType !== ADDRESS_TYPES.LOCKBOX) {
        let password = yield call(promptForSecondPassword)
        payment = yield payment.sign(password)
      } else {
        const deviceR = yield select(
          selectors.core.kvStore.lockbox.getDeviceFromBchXpubs,
          prop('from', p.getOrElse({}))
        )
        const device = deviceR.getOrFail('missing_device')
        const deviceType = prop('device_type', device)
        const outputs = path(['selection', 'outputs'], payment.value())
          .filter(o => !o.change)
          .map(prop('address'))
        yield call(promptForLockbox, 'BCH', deviceType, outputs)
        let connection = yield select(
          selectors.components.lockbox.getCurrentConnection
        )
        const transport = prop('transport', connection)
        const scrambleKey = Lockbox.utils.getScrambleKey('BCH', deviceType)
        payment = yield payment.sign(null, transport, scrambleKey)
      }
      // Publish payment
      payment = yield payment.publish()
      yield put(actions.core.data.bch.fetchData())
      yield put(A.sendBchPaymentUpdated(Remote.of(payment.value())))
      // Set tx note
      if (path(['description', 'length'], payment.value())) {
        yield put(
          actions.core.kvStore.bch.setTxNotesBch(
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
          selectors.core.kvStore.lockbox.getDeviceFromBchXpubs,
          fromXPubs
        )).getOrFail('missing_device')
        const deviceIndex = prop('device_index', device)
        yield put(actions.router.push(`/lockbox/dashboard/${deviceIndex}`))
      } else {
        yield put(actions.router.push('/bch/transactions'))
        yield put(actions.alerts.displaySuccess(C.SEND_BCH_SUCCESS))
      }
      yield put(destroy(FORM))
      // Close modals
      yield put(actions.modals.closeAllModals())
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
        yield put(actions.alerts.displayError(C.SEND_BCH_ERROR))
      }
    }
  }

  return {
    initialized,
    destroyed,
    toToggled,
    maximumAmountClicked,
    firstStepSubmitClicked,
    secondStepSubmitClicked,
    formChanged
  }
}
