import { takeEvery } from 'redux-saga/effects'
import * as AT from '../../actionTypes'
import sagas from './sagas'

export default () => {
  const requestBchSagas = sagas()

  return function * () {
    yield takeEvery(AT.core.webSocket.bch.PAYMENT_RECEIVED, requestBchSagas.bchPaymentReceived)
  }
}
