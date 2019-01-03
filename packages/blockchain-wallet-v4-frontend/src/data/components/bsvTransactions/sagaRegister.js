import { takeEvery, takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actionTypes from '../../actionTypes'
import sagas from './sagas'

export default () => {
  const bsvTransactionsSagas = sagas()

  return function* bsvTransactionsSaga () {
    yield takeEvery(
      AT.BSV_TRANSACTIONS_INITIALIZED,
      bsvTransactionsSagas.initialized
    )
    yield takeLatest(
      AT.BSV_TRANSACTIONS_LOAD_MORE,
      bsvTransactionsSagas.loadMore
    )
    yield takeEvery(actionTypes.form.CHANGE, bsvTransactionsSagas.formChanged)
  }
}
