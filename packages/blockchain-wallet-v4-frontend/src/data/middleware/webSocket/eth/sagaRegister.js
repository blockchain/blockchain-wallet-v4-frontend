import {takeEvery} from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, ethSocket }) => {
  const ethSocketSagas = sagas({ api, ethSocket })

  return function * () {
    yield takeEvery(AT.OPEN_SOCKET, ethSocketSagas.onOpen)
    yield takeEvery(AT.MESSAGE_SOCKET, ethSocketSagas.onMessage)
    yield takeEvery(AT.CLOSE_SOCKET, ethSocketSagas.onClose)
  }
}
