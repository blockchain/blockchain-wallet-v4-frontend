import { fork, takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as kvAT from '../../kvStore/actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const dataBchSagas = sagas({ api })

  return function* coreDataBchSaga () {
    yield takeLatest(kvAT.bch.SET_BCH_ACCOUNT_ARCHIVED, dataBchSagas.fetchData)
    yield takeLatest(AT.FETCH_BCH_DATA, dataBchSagas.fetchData)
    yield takeLatest(AT.FETCH_BCH_FEE, dataBchSagas.fetchFee)
    yield takeLatest(AT.FETCH_BCH_RATES, dataBchSagas.fetchRates)
    yield fork(dataBchSagas.watchTransactions)
    yield takeLatest(
      AT.FETCH_BCH_TRANSACTION_HISTORY,
      dataBchSagas.fetchTransactionHistory
    )
  }
}
