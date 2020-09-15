import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api }) => {
  const exchangeHistorySagas = sagas({ api })

  return function * exchangeHistorySaga () {
    yield takeLatest(
      AT.EXCHANGE_HISTORY_DESTROYED,
      exchangeHistorySagas.exchangeHistoryDestroyed
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
