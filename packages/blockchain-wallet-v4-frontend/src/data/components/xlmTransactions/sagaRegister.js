import { takeEvery, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const xlmTransactionsSagas = sagas()

  return function * xlmTransactionsSaga() {
    yield takeEvery(
      AT.TRANSACTIONS_INITIALIZED,
      xlmTransactionsSagas.initialized
    )
    yield takeLatest(
      AT.XLM_TRANSACTIONS_LOAD_MORE,
      xlmTransactionsSagas.loadMore
    )
  }
}
