import { takeEvery, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const algoTransactionsSagas = sagas()

  return function * algoTransactionsSaga() {
    yield takeEvery(
      AT.TRANSACTIONS_INITIALIZED,
      algoTransactionsSagas.initialized
    )
    yield takeLatest(
      AT.ALGO_TRANSACTIONS_LOAD_MORE,
      algoTransactionsSagas.loadMore
    )
  }
}
