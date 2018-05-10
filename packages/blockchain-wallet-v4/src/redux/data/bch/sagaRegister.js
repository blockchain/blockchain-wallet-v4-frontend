import { takeLatest, fork } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const dataBchSagas = sagas({ api })

  return function * () {
    yield takeLatest(AT.FETCH_BCH_DATA, dataBchSagas.fetchData)
    yield takeLatest(AT.FETCH_BCH_RATES, dataBchSagas.fetchRates)
    yield takeLatest(AT.FETCH_BCH_FEE, dataBchSagas.fetchFee)
    yield fork(dataBchSagas.watchTransactions)
    yield takeLatest(AT.FETCH_BCH_TRANSACTION_HISTORY, dataBchSagas.fetchTransactionHistory)
  }
}
