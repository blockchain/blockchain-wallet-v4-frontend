import { takeEvery } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ activitiesSocket, api }) => {
  const activitiesSocketSagas = sagas({ api, socket: activitiesSocket })
  return function* activitiesSocketSaga() {
    yield takeEvery(AT.OPEN_SOCKET, activitiesSocketSagas.onOpen)
    yield takeEvery(AT.AUTH_SOCKET, activitiesSocketSagas.onAuth)
    yield takeEvery(AT.MESSAGE_SOCKET, activitiesSocketSagas.onMessage)
    yield takeEvery(AT.CLOSE_SOCKET, activitiesSocketSagas.onClose)
  }
}
