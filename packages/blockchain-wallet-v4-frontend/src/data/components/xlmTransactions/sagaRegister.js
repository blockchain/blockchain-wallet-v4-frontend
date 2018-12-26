import { takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const xlmTransactionsSagas = sagas()

  return function*() {
    yield takeEvery(
      AT.TRANSACTIONS_INITIALIZED,
      xlmTransactionsSagas.initialized
    )
    yield takeEvery(
      AT.TRANSACTIONS_REPORT_CLICKED,
      xlmTransactionsSagas.reportClicked
    )
  }
}
