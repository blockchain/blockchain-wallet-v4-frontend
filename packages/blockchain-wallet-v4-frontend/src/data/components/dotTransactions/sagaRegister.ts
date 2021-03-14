import { takeEvery, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const dotTransactionsSagas = sagas()

  return function * algoTransactionsSaga() {
    yield takeEvery(
      AT.TRANSACTIONS_INITIALIZED,
      dotTransactionsSagas.initialized
    )
    yield takeLatest(
      AT.DOT_TRANSACTIONS_LOAD_MORE,
      dotTransactionsSagas.loadMore
    )
  }
}
