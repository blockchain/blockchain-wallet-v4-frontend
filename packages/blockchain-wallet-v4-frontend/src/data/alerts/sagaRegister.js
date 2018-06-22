import { takeEvery } from 'redux-saga/effects'
import * as actionTypes from '../actionTypes'
import * as sagas from './sagas'

export default function * () {
  yield takeEvery(actionTypes.alerts.ALERTS_SHOW, sagas.handleTimer)
  yield takeEvery(actionTypes.middleware.webSocket.btc.PAYMENT_RECEIVED, sagas.paymentReceived)
}
