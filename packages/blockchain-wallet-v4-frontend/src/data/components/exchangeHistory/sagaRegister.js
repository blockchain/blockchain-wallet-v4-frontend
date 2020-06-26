import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const exchangeHistorySagas = sagas({ api, coreSagas })

  return function * exchangeHistorySaga () {
    yield takeLatest(
      AT.EXCHANGE_HISTORY_INITIALIZED,
      exchangeHistorySagas.exchangeHistoryInitialized
    )
    yield takeLatest(
      AT.EXCHANGE_HISTORY_DESTROYED,
      exchangeHistorySagas.exchangeHistoryDestroyed
    )
    yield takeLatest(
      AT.EXCHANGE_HISTORY_MODAL_INITIALIZED,
      exchangeHistorySagas.exchangeHistoryModalInitialized
    )
    yield takeLatest(
      AT.EXCHANGE_HISTORY_MODAL_DESTROYED,
      exchangeHistorySagas.exchangeHistoryModalDestroyed
    )
    yield takeLatest(AT.FETCH_NEXT_PAGE, exchangeHistorySagas.fetchNextPage)
    yield takeLatest(
      AT.STOP_POLLING_TRADES,
      exchangeHistorySagas.stopPollingTrades
    )
    yield takeLatest(
      AT.DOWNLOAD_HISTORY,
      exchangeHistorySagas.exchangeHistoryDownload
    )
  }
}
