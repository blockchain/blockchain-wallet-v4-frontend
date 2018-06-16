import { takeEvery } from 'redux-saga/effects'
import * as AT from '../actionTypes'
import * as sagas from './sagas'

export default function * () {
  yield takeEvery(AT.alerts.ALERTS_SHOW, sagas.handleTimer)
  yield takeEvery(AT.core.webSocket.bch.BCH_PAYMENT_RECEIVED, sagas.bchPaymentReceived)
  yield takeEvery(AT.core.webSocket.ethereum.ETH_PAYMENT_RECEIVED, sagas.ethPaymentReceived)
  yield takeEvery(AT.core.webSocket.bitcoin.BTC_PAYMENT_RECEIVED, sagas.btcPaymentReceived)
}
