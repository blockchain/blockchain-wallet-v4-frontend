import { takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, ratesSocket }) => {
  const publicRatesSocketSagas = sagas({ api, ratesSocket })

  return function* publicRatesSocketSaga () {
    yield takeEvery(AT.OPEN_SOCKET, publicRatesSocketSagas.onOpen)
    yield takeEvery(AT.MESSAGE_SOCKET, publicRatesSocketSagas.onMessage)
    yield takeEvery(AT.CLOSE_SOCKET, publicRatesSocketSagas.onClose)
    yield takeEvery(AT.REST_FALLBACK, publicRatesSocketSagas.restFallback)
    yield takeEvery(
      AT.OPEN_ADVICE_CHANNEL,
      publicRatesSocketSagas.openAdviceChannel
    )
    yield takeEvery(
      AT.CLOSE_ADVICE_CHANNEL,
      publicRatesSocketSagas.closeAdviceChannel
    )
    yield takeEvery(
      AT.OPEN_RATES_CHANNEL,
      publicRatesSocketSagas.openRatesChannel
    )
    yield takeEvery(
      AT.CLOSE_RATES_CHANNEL,
      publicRatesSocketSagas.closeRatesChannel
    )
  }
}
