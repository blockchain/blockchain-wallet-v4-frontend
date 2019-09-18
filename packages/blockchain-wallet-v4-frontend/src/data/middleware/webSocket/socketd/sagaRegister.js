import { takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, socketd }) => {
  const socketDSagas = sagas({ api, socket: socketd })
  return function * socketDSaga () {
    yield takeEvery(AT.OPEN_SOCKET, socketDSagas.onOpen)
    yield takeEvery(AT.MESSAGE_SOCKET, socketDSagas.onMessage)
    yield takeEvery(AT.CLOSE_SOCKET, socketDSagas.onClose)
  }
}
