import { call, select, takeLatest, put } from 'redux-saga/effects'
import { equals, path, prop, nth, is, identity } from 'ramda'
import * as AT from './actionTypes'
import * as A from './actions'
import * as S from './selectors'
import * as actions from '../../actions'
import * as selectors from '../../selectors'
import settings from 'config'

import { actionTypes, initialize, change } from 'redux-form'
import { promptForSecondPassword } from 'services/SagaService'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'

export default ({ coreSagas }) => {
  const sendBchInitialized = function * (action, password) {
    try {
      yield put(A.sendBchPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.bch.create(({ network: settings.NETWORK_BCH }))
      payment = yield payment.init()
      const accountsR = yield select(selectors.core.common.bch.getAccountsBalances)
      const defaultIndex = yield select(selectors.core.wallet.getDefaultAccountIndex)
      const defaultAccountR = accountsR.map(nth(defaultIndex))
      payment = yield payment.from(defaultIndex)
      // TODO: Check how to retrieve Bitcoin cash default fee
      payment = yield payment.fee(2)
      const initialValues = {
        coin: 'BCH',
        from: defaultAccountR.getOrElse()
      }
      yield put(initialize('sendBch', initialValues))
      yield put(A.sendBchPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      console.log('error: ', e)
    }
  }

  const firstStepSubmitClicked = function * (action) {
    try {
      let p = yield select(S.getPayment)
      yield put(A.sendBchPaymentUpdated(Remote.Loading))
      let payment = coreSagas.payment.bch.create({ payment: p.getOrElse({}), network: settings.NETWORK_BCH })
      payment = yield payment.build()
      yield put(A.sendBchPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      console.log(e)
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
          yield put(actions.modals.closeAllModals())
          switch (payload) {
            case 'BTC': yield put(actions.modals.showModal('SendBitcoin')); break
            case 'ETH': yield put(actions.modals.showModal('SendEther')); break
          }
          break
        case 'from':
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
        case 'message':
          payment = yield payment.description(payload)
          break
      }
      try { payment = yield payment.build() } catch (e) {}
      yield put(A.sendBchPaymentUpdated(Remote.of(payment.value())))
    } catch (e) {
      console.log(e)
    }
  }

  const toToggled = function * () {
    try {
      yield put(change('sendBch', 'to', ''))
    } catch (e) {
      console.log(e)
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
      console.log(e)
    }
  }

  const secondStepSubmitClicked = function * () {
    try {
      let p = yield select(S.getPayment)
      let payment = coreSagas.payment.bch.create({ payment: p.getOrElse({}), network: settings.NETWORK_BCH })
      const password = yield call(promptForSecondPassword)
      payment = yield payment.sign(password)
      payment = yield payment.publish()
      yield put(A.sendBchPaymentUpdated(Remote.of(payment.value())))
      yield put(actions.modals.closeAllModals())
      yield put(actions.router.push('/bch/transactions'))
      yield put(actions.alerts.displaySuccess('Bitcoin cash transaction has been successfully published!'))
    } catch (e) {
      console.log(e)
      yield put(actions.alerts.displayError('Bitcoin cash transaction could not be published.'))
    }
  }

  return function * () {
    yield takeLatest(AT.SEND_BCH_INITIALIZED, sendBchInitialized)
    yield takeLatest(AT.SEND_BCH_FIRST_STEP_TO_TOGGLED, toToggled)
    yield takeLatest(AT.SEND_BCH_FIRST_STEP_MAXIMUM_AMOUNT_CLICKED, maximumAmountClicked)
    yield takeLatest(AT.SEND_BCH_FIRST_STEP_SUBMIT_CLICKED, firstStepSubmitClicked)
    yield takeLatest(AT.SEND_BCH_SECOND_STEP_SUBMIT_CLICKED, secondStepSubmitClicked)
    yield takeLatest(actionTypes.CHANGE, formChanged)
  }
}
