import { takeEvery, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const coinTransactionsSagas = sagas()

  return function* coinTransactionsSaga() {
    yield takeEvery(AT.TRANSACTIONS_INITIALIZED, coinTransactionsSagas.initialized)
    yield takeLatest(AT.COIN_TRANSACTIONS_LOAD_MORE, coinTransactionsSagas.loadMore)
  }
}
