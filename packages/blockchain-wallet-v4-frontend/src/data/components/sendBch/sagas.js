import { call, select, takeLatest, put } from 'redux-saga/effects'
import { equals, path, prop, nth, is } from 'ramda'
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
            case 'ETH': yield put(actions.modals.showModal('SendEther')); break
            case 'BCH': yield put(actions.modals.showModal('SendBch')); break
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
          const satoshis = Exchange.convertBitcoinToBitcoin({ value: payload, fromUnit: 'BTC', toUnit: 'SAT' }).value
          payment = yield payment.amount(parseInt(satoshis))
          break
        case 'message':
          payment = yield payment.description(payload)
          break
      }
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
    yield takeLatest(AT.SEND_BCH_FIRST_STEP_SUBMIT_CLICKED, firstStepSubmitClicked)
    yield takeLatest(AT.SEND_BCH_SECOND_STEP_SUBMIT_CLICKED, secondStepSubmitClicked)
    yield takeLatest(actionTypes.CHANGE, formChanged)
  }
}
