import { takeEvery } from 'redux-saga/effects'
import * as AT from '../actionTypes'
import * as sagas from './sagas'

export default function * () {
  yield takeEvery(AT.alerts.ALERTS_SHOW, sagas.handleTimer)
  yield takeEvery(AT.core.webSocket.bitcoin.PAYMENT_RECEIVED, sagas.paymentReceived)
}
