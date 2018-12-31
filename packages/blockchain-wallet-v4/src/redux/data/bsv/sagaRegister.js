import { fork, takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const dataBsvSagas = sagas({ api })

  return function* coreDataBsvSaga () {
    yield takeLatest(AT.FETCH_BSV_DATA, dataBsvSagas.fetchData)
    yield takeLatest(AT.FETCH_BSV_FEE, dataBsvSagas.fetchFee)
    yield takeLatest(AT.FETCH_BSV_RATES, dataBsvSagas.fetchRates)
    yield fork(dataBsvSagas.watchTransactions)
  }
}
