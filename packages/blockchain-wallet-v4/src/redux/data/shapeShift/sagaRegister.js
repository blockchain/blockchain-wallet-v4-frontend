import { takeEvery, takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api } = {}) => {
  const dataShapeshiftSagas = sagas({ api })

  return function * () {
    yield takeEvery(AT.FETCH_PAIR, dataShapeshiftSagas.fetchPair)
    yield takeLatest(AT.FETCH_SHAPESHIFT_ORDER, dataShapeshiftSagas.fetchOrder)
    yield takeLatest(AT.FETCH_SHAPESHIFT_QUOTATION, dataShapeshiftSagas.fetchQuotation)
    // yield fork(watchShapeshiftQuotation)
  }
}
