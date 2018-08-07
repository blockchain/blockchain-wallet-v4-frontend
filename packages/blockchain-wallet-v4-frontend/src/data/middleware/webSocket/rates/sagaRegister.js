import { takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagasFactory from './sagas'

export default ({ api, ratesSocket }) => {
  const sagas = sagasFactory({ api, ratesSocket })

  return function*() {
    yield takeEvery(AT.OPEN_SOCKET, sagas.onOpen)
    yield takeEvery(AT.MESSAGE_SOCKET, sagas.onMessage)
    yield takeEvery(AT.CLOSE_SOCKET, sagas.onClose)
    yield takeEvery(AT.REST_FALLBACK, sagas.restFallback)
    yield takeEvery(AT.OPEN_CHANNEL_FOR_PAIRS, sagas.openChannelForPairs)
    yield takeEvery(AT.CLOSE_CHANNEL_FOR_PAIRS, sagas.closeChannelForPairs)
  }
}
