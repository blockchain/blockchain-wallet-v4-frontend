import { fork, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const dataDotSagas = sagas({ api })

  return function* coreDataDotSaga() {
    yield takeLatest(AT.FETCH_DOT_RATES, dataDotSagas.fetchRates)
    yield takeLatest(AT.FETCH_DOT_TRANSACTION_HISTORY, dataDotSagas.fetchTransactionHistory)
    yield fork(dataDotSagas.watchTransactions)
  }
}
