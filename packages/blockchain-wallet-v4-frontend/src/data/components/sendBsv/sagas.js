import { call, select, put } from 'redux-saga/effects'
import { equals, path, prop, nth, is, identity } from 'ramda'
import * as A from './actions'
import * as S from './selectors'
import { FORM } from './model'
import { actions, model, selectors } from 'data'
import settings from 'config'
import {
  initialize,
  change,
  startSubmit,
  stopSubmit,
  destroy
} from 'redux-form'
import * as C from 'services/AlertService'
import { promptForSecondPassword } from 'services/SagaService'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'

export const logLocation = 'components/sendBsv/sagas'
export const bsvDefaultFee = 4

export default ({ coreSagas }) => {
  const initialized = function*() {
    try {
      yield put(A.sendBsvPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.bsv.create({
        network: settings.NETWORK_BSV
      })
      payment = yield payment.init()
      const accountsR = yield select(
        selectors.core.common.bsv.getAccountsBalances
      )
      const defaultIndexR = yield select(
        selectors.core.kvStore.bsv.getDefaultAccountIndex
      )
      const defaultIndex = defaultIndexR.getOrElse(0)
      const defaultAccountR = accountsR.map(nth(defaultIndex))
      payment = yield payment.from(defaultIndex, ADDRESS_TYPES.ACCOUNT)
      payment = yield payment.fee(bsvDefaultFee)
      const initialValues = {
        coin: 'BSV',
        from: defaultAccountR.getOrElse()
      }
      yield put(initialize(FORM, initialValues))
      yield put(A.sendBsvPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'sendBsvInitialized', e)
      )
    }
  }

  const destroyed = function*() {
    yield put(actions.form.destroy(FORM))
  }

  const firstStepSubmitClicked = function*() {
    try {
      let p = yield select(S.getPayment)
      yield put(A.sendBsvPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.bsv.create({
        payment: p.getOrElse({}),
        network: settings.NETWORK_BSV
      })
      payment = yield payment.build()
      yield put(A.sendBsvPaymentUpdated(Remote.of(payment.value())))
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
      let payment = coreSagas.payment.bsv.create({
        payment: p.getOrElse({}),
        network: settings.NETWORK_BSV
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
            default:
              const address = prop('address', payload) || payload
              payment = yield payment.to(address, toType)
          }
          break
        case 'amount':
          const bsvAmount = prop('coin', payload)
          const satAmount = Exchange.convertBsvToBsv({
            value: bsvAmount,
            fromUnit: 'BSV',
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
      yield put(A.sendBsvPaymentUpdated(Remote.of(payment.value())))
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
      const bsvRates = selectors.core.data.bsv
        .getRates(appState)
        .getOrFail('Can not retrieve bitcoin cash rates.')
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const effectiveBalance = prop('effectiveBalance', payment)
      const coin = Exchange.convertBsvToBsv({
        value: effectiveBalance,
        fromUnit: 'SAT',
        toUnit: 'BSV'
      }).value
      const fiat = Exchange.convertBsvToFiat({
        value: effectiveBalance,
        fromUnit: 'SAT',
        toCurrency: currency,
        rates: bsvRates
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
    let payment = coreSagas.payment.bsv.create({
      payment: p.getOrElse({}),
      network: settings.NETWORK_BSV
    })
    try {
      // Sign payment
      let password = yield call(promptForSecondPassword)
      payment = yield payment.sign(password)
      // Publish payment
      payment = yield payment.publish()
      yield put(actions.core.data.bsv.fetchData())
      yield put(A.sendBsvPaymentUpdated(Remote.of(payment.value())))
      // Set tx note
      if (path(['description', 'length'], payment.value())) {
        yield put(
          actions.core.kvStore.bsv.setTxNotesBsv(
            payment.value().txId,
            payment.value().description
          )
        )
      }
      // Redirect to tx list, display success
      yield put(actions.router.push('/settings/addresses/bsv'))
      yield put(actions.alerts.displaySuccess(C.SEND_BSV_SUCCESS))
      yield put(destroy(FORM))
      // Close modals
      yield put(actions.modals.closeAllModals())
    } catch (e) {
      yield put(stopSubmit(FORM))
      // Set errors
      yield put(
        actions.logs.logErrorMessage(logLocation, 'secondStepSubmitClicked', e)
      )
      yield put(actions.alerts.displayError(C.SEND_BSV_ERROR))
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
