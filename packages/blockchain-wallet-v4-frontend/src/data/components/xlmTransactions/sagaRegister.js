import { takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actionTypes from '../../actionTypes'
import sagas from './sagas'

export default () => {
  const btcTransactionsSagas = sagas()

  return function*() {
    yield takeEvery(
      AT.TRANSACTIONS_INITIALIZED,
      btcTransactionsSagas.initialized
    )
    yield takeEvery(
      AT.TRANSACTIONS_REPORT_CLICKED,
      btcTransactionsSagas.reportClicked
    )
    yield takeEvery(
      actionTypes.scroll.UPDATE_SCROLL,
      btcTransactionsSagas.scrollUpdated
    )
  }
}
