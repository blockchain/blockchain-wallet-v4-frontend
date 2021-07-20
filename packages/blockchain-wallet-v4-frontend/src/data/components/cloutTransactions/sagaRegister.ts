import { takeEvery, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const cloutTransactionsSagas = sagas()

  return function* cloutTransactionsSaga() {
    yield takeEvery(AT.TRANSACTIONS_INITIALIZED, cloutTransactionsSagas.initialized)
    yield takeLatest(AT.CLOUT_TRANSACTIONS_LOAD_MORE, cloutTransactionsSagas.loadMore)
  }
}
