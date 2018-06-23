import { takeEvery, takeLatest } from 'redux-saga/effects'
import * as requestAT from './actionTypes'
import * as AT from '../../actionTypes'
import sagas from './sagas'

export default () => {
  const requestBtcSagas = sagas()

  return function * () {
    yield takeLatest(requestAT.REQUEST_BTC_FIRST_STEP_SUBMIT_CLICKED, requestBtcSagas.firstStepSubmitClicked)
    yield takeEvery(AT.core.webSocket.bitcoin.PAYMENT_RECEIVED, requestBtcSagas.btcPaymentReceived)
  }
}
