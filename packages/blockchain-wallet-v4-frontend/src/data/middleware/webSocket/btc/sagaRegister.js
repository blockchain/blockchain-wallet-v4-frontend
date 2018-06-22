import {takeEvery} from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, btcSocket }) => {
  const btcSocketSagas = sagas({ api, btcSocket })

  return function * () {
    yield takeEvery(AT.OPEN_SOCKET, btcSocketSagas.onOpen)
    yield takeEvery(AT.MESSAGE_SOCKET, btcSocketSagas.onMessage)
    yield takeEvery(AT.CLOSE_SOCKET, btcSocketSagas.onClose)
  }
}
