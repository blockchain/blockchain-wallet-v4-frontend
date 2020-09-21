import * as AT from './actionTypes'
import { takeEvery } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api, coinsSocket }) => {
  const coinsSocketSagas = sagas({ api, socket: coinsSocket })
  return function * coinsSocketSaga () {
    yield takeEvery(AT.OPEN_SOCKET, coinsSocketSagas.onOpen)
    yield takeEvery(AT.AUTH_SOCKET, coinsSocketSagas.onAuth)
    yield takeEvery(AT.MESSAGE_SOCKET, coinsSocketSagas.onMessage)
    yield takeEvery(AT.CLOSE_SOCKET, coinsSocketSagas.onClose)
  }
}
