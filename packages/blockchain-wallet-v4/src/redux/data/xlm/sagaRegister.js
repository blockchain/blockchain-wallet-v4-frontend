import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const dataXlmSagas = sagas({ api })

  return function*() {
    yield takeLatest(AT.FETCH_LEDGER_DETAILS, dataXlmSagas.fetchLedgerDetails)
    yield takeLatest(AT.FETCH_ACCOUNT, dataXlmSagas.fetchAccount)
    yield takeLatest(AT.FETCH_XLM_RATES, dataXlmSagas.fetchRates)
  }
}
