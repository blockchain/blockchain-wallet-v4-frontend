import { fork, takeEvery, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const dataBtcSagas = sagas({ api })

  return function* coreDataBtcSaga() {
    yield takeLatest(AT.FETCH_BTC_DATA, dataBtcSagas.fetchData)
    yield takeLatest(AT.FETCH_BTC_RATES, dataBtcSagas.fetchRates)
    yield fork(dataBtcSagas.watchTransactions)
    yield takeEvery(AT.FETCH_BTC_FIAT_AT_TIME, dataBtcSagas.fetchFiatAtTime)
    yield takeLatest(AT.FETCH_BTC_TRANSACTION_HISTORY, dataBtcSagas.fetchTransactionHistory)
  }
}
