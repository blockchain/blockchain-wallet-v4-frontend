import { takeEvery, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const dogeTransactionsSagas = sagas()

  return function* dogeTransactionsSaga() {
    yield takeEvery(AT.TRANSACTIONS_INITIALIZED, dogeTransactionsSagas.initialized)
    yield takeLatest(AT.DOGE_TRANSACTIONS_LOAD_MORE, dogeTransactionsSagas.loadMore)
  }
}
