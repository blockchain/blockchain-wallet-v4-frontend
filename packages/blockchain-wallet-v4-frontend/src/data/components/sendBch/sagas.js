import { call, select, put } from 'redux-saga/effects'
import { equals, path, prop, nth, is, identity } from 'ramda'
import * as A from './actions'
import * as S from './selectors'
import * as actions from '../../actions'
import * as selectors from '../../selectors'
import settings from 'config'
import { initialize, change } from 'redux-form'
import * as C from 'services/AlertService'
import { promptForSecondPassword } from 'services/SagaService'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'

export const logLocation = 'components/sendBch/sagas'
// TODO: Check how to retrieve Bitcoin cash default fee
export const bchDefaultFee = 2

export default ({ coreSagas }) => {
  const initialized = function * () {
    try {
      yield put(A.sendBchPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.bch.create(({ network: settings.NETWORK_BCH }))
      payment = yield payment.init()
      const accountsR = yield select(selectors.core.common.bch.getAccountsBalances)
      const defaultIndexR = yield select(selectors.core.kvStore.bch.getDefaultAccountIndex)
      const defaultIndex = defaultIndexR.getOrElse(0)
      const defaultAccountR = accountsR.map(nth(defaultIndex))
      payment = yield payment.from(defaultIndex)
      payment = yield payment.fee(bchDefaultFee)
      const initialValues = {
        coin: 'BCH',
        from: defaultAccountR.getOrElse()
      }
      yield put(initialize('sendBch', initialValues))
      yield put(A.sendBchPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'sendBchInitialized', e))
    }
  }

  const destroyed = function * () {
    yield put(actions.form.destroy('sendBch'))
  }

  const firstStepSubmitClicked = function * () {
    try {
      let p = yield select(S.getPayment)
      yield put(A.sendBchPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.bch.create({ payment: p.getOrElse({}), network: settings.NETWORK_BCH })
      payment = yield payment.build()
      yield put(A.sendBchPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'firstStepSubmitClicked', e))
    }
  }

  const formChanged = function * (action) {
    try {
      const form = path(['meta', 'form'], action)
      const field = path(['meta', 'field'], action)
      const payload = prop('payload', action)
      if (!equals('sendBch', form)) return

      let p = yield select(S.getPayment)
      let payment = coreSagas.payment.bch.create({ payment: p.getOrElse({}), network: settings.NETWORK_BCH })

      switch (field) {
        case 'coin':
          switch (payload) {
            case 'BTC': {
              yield put(actions.modals.closeAllModals())
              yield put(actions.modals.showModal('SendBitcoin'))
              break
            }
            case 'ETH': {
              yield put(actions.modals.closeAllModals())
              yield put(actions.modals.showModal('SendEther'))
            }
          }
          break
        case 'from':
          yield put(A.sendBchFirstStepToToggled(false))
          const source = prop('address', payload) || prop('index', payload)
          payment = yield payment.from(source)
          break
        case 'to':
          const target = is(String, payload)
            ? payload
            : prop('address', payload) || prop('index', payload)
          payment = yield payment.to(target)
          break
        case 'amount':
          const bchAmount = prop('coin', payload)
          const satAmount = Exchange.convertBchToBch({ value: bchAmount, fromUnit: 'BCH', toUnit: 'SAT' }).value
          payment = yield payment.amount(parseInt(satAmount))
          break
        case 'description':
          payment = yield payment.description(payload)
          break
      }
      try { payment = yield payment.build() } catch (e) {}
      yield put(A.sendBchPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'formChanged', e))
    }
  }

  const toToggled = function * () {
    try {
      yield put(change('sendBch', 'to', ''))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'toToggled', e))
    }
  }

  const maximumAmountClicked = function * () {
    try {
      const appState = yield select(identity)
      const currency = selectors.core.settings.getCurrency(appState).getOrFail('Can not retrieve currency.')
      const bchRates = selectors.core.data.bch.getRates(appState).getOrFail('Can not retrieve bitcoin cash rates.')
      const p = yield select(S.getPayment)
      const payment = p.getOrElse({})
      const effectiveBalance = prop('effectiveBalance', payment)
      const coin = Exchange.convertBchToBch({ value: effectiveBalance, fromUnit: 'SAT', toUnit: 'BCH' }).value
      const fiat = Exchange.convertBchToFiat({ value: effectiveBalance, fromUnit: 'SAT', toCurrency: currency, rates: bchRates }).value
      yield put(change('sendBch', 'amount', { coin, fiat }))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'maximumAmountClicked', e))
    }
  }

  const secondStepSubmitClicked = function * () {
    try {
      let p = yield select(S.getPayment)
      let payment = coreSagas.payment.bch.create({ payment: p.getOrElse({}), network: settings.NETWORK_BCH })
      const password = yield call(promptForSecondPassword)
      yield put(actions.modals.closeAllModals())
      payment = yield payment.sign(password)
      payment = yield payment.publish()
      yield put(A.sendBchPaymentUpdated(Remote.of(payment.value())))
      if (path(['description', 'length'], payment.value())) {
        yield put(actions.core.kvStore.bch.setTxNotesBch(payment.value().txId, payment.value().description))
      }
      yield put(actions.core.data.bch.fetchData())
      yield put(actions.router.push('/bch/transactions'))
      yield put(actions.alerts.displaySuccess(C.SEND_BCH_SUCCESS))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'secondStepSubmitClicked', e))
      yield put(actions.alerts.displayError(C.SEND_BCH_ERROR))
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
