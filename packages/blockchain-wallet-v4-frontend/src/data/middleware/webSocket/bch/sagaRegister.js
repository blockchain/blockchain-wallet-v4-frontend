import {takeEvery} from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, bchSocket }) => {
  const bchSocketSagas = sagas({ api, bchSocket })

  return function * () {
    yield takeEvery(AT.OPEN_SOCKET, bchSocketSagas.onOpen)
    yield takeEvery(AT.MESSAGE_SOCKET, bchSocketSagas.onMessage)
    yield takeEvery(AT.CLOSE_SOCKET, bchSocketSagas.onClose)
  }
}
