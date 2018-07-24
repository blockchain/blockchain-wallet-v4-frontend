import { takeEvery, takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const exchangeHistorySagas = sagas({ api, coreSagas })

  return function * () {
    yield takeEvery(AT.EXCHANGE_HISTORY_INITIALIZED, exchangeHistorySagas.exchangeHistoryInitialized)
    yield takeLatest(AT.EXCHANGE_HISTORY_MODAL_INITIALIZED, exchangeHistorySagas.exchangeHistoryModalInitialized)
    yield takeLatest(AT.EXCHANGE_HISTORY_MODAL_DESTROYED, exchangeHistorySagas.exchangeHistoryModalDestroyed)
  }
}
