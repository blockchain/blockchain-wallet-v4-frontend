import { takeEvery, takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actionTypes from '../../actionTypes'
import sagas from './sagas'

export default () => {
  const btcTransactionsSagas = sagas()

  return function* btcTransactionsSaga () {
    yield takeEvery(
      AT.BTC_TRANSACTIONS_INITIALIZED,
      btcTransactionsSagas.initialized
    )
    yield takeEvery(
      AT.BTC_TRANSACTIONS_REPORT_CLICKED,
      btcTransactionsSagas.reportClicked
    )
    yield takeLatest(
      AT.BTC_TRANSACTIONS_LOAD_MORE,
      btcTransactionsSagas.loadMore
    )
    yield takeEvery(actionTypes.form.CHANGE, btcTransactionsSagas.formChanged)
  }
}
