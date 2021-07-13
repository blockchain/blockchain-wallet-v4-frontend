import { takeEvery, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const fiatTransactionsSagas = sagas()

  return function * fiatTransactionsSaga() {
    yield takeEvery(
      AT.FIAT_TRANSACTIONS_INITIALIZED,
      fiatTransactionsSagas.initialized
    )
    yield takeLatest(
      AT.FIAT_TRANSACTIONS_LOAD_MORE,
      fiatTransactionsSagas.loadMore
    )
  }
}
