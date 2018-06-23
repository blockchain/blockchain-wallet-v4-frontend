import { takeEvery } from 'redux-saga/effects'
import * as AT from '../../actionTypes'
import sagas from './sagas'

export default () => {
  const requestEthSagas = sagas()

  return function * () {
    yield takeEvery(AT.core.webSocket.ethereum.PAYMENT_RECEIVED, requestEthSagas.ethPaymentReceived)
  }
}
