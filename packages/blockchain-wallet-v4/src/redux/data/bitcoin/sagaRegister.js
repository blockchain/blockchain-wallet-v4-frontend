import { takeLatest, takeEvery, fork } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const dataBtcSagas = sagas({ api })

  return function * () {
    yield takeLatest(AT.FETCH_BITCOIN_DATA, dataBtcSagas.fetchData)
    yield takeLatest(AT.FETCH_BITCOIN_FEE, dataBtcSagas.fetchFee)
    yield takeEvery(AT.FETCH_BITCOIN_FIAT_AT_TIME, dataBtcSagas.fetchFiatAtTime)
    yield takeLatest(AT.FETCH_BITCOIN_RATES, dataBtcSagas.fetchRates)
    yield fork(dataBtcSagas.watchTransactions)
    yield takeLatest(AT.FETCH_BITCOIN_TRANSACTION_HISTORY, dataBtcSagas.fetchTransactionHistory)
  }
}
