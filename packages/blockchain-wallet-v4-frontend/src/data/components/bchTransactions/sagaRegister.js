import { takeEvery, takeLatest } from 'redux-saga/effects'

import * as actionTypes from '../../actionTypes'
import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const bchTransactionsSagas = sagas()

  return function * btcTransactionsSaga() {
    yield takeEvery(
      AT.BCH_TRANSACTIONS_INITIALIZED,
      bchTransactionsSagas.initialized
    )
    yield takeLatest(
      AT.BCH_TRANSACTIONS_LOAD_MORE,
      bchTransactionsSagas.loadMore
    )
    yield takeEvery(actionTypes.form.CHANGE, bchTransactionsSagas.formChanged)
  }
}
