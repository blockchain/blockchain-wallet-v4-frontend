import { takeEvery } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagasFactory from './sagas'

export default ({ api, ratesSocket }) => {
  const sagas = sagasFactory({ api, ratesSocket })

  return function * ratesSocketSaga() {
    yield takeEvery(AT.OPEN_SOCKET, sagas.onOpen)
    yield takeEvery(AT.MESSAGE_SOCKET, sagas.onMessage)
    yield takeEvery(AT.CLOSE_SOCKET, sagas.onClose)
    yield takeEvery(AT.REST_FALLBACK, sagas.restFallback)
    yield takeEvery(AT.AUTHENTICATE_SOCKET, sagas.authenticateSocket)
    yield takeEvery(AT.OPEN_ADVICE_CHANNEL, sagas.openAdviceChannel)
    yield takeEvery(AT.CLOSE_ADVICE_CHANNEL, sagas.closeAdviceChannel)
    yield takeEvery(AT.OPEN_RATES_CHANNEL, sagas.openRatesChannel)
    yield takeEvery(AT.CLOSE_RATES_CHANNEL, sagas.closeRatesChannel)
  }
}
