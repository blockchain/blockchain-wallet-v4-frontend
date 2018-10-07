import { fork, takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const dataXlmSagas = sagas({ api })

  return function*() {
    yield takeLatest(AT.FETCH_XLM_DATA, dataXlmSagas.fetchData)
    yield takeLatest(AT.FETCH_XLM_RATES, dataXlmSagas.fetchRates)
    yield fork(dataXlmSagas.watchTransactions)
  }
}
