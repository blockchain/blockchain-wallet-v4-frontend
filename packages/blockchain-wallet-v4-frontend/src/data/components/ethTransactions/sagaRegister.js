import { takeEvery, takeLatest } from 'redux-saga/effects'

import * as actionTypes from '../../actionTypes'
import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const ethTransactionsSagas = sagas()

  return function * ethTransactionsSaga() {
    yield takeEvery(
      AT.ETH_TRANSACTIONS_INITIALIZED,
      ethTransactionsSagas.initialized
    )
    yield takeLatest(
      AT.ETH_TRANSACTIONS_LOAD_MORE,
      ethTransactionsSagas.loadMore
    )
    yield takeEvery(
      AT.ERC20_TRANSACTIONS_INITIALIZED,
      ethTransactionsSagas.initializedErc20
    )
    yield takeLatest(
      AT.ERC20_TRANSACTIONS_LOAD_MORE,
      ethTransactionsSagas.loadMoreErc20
    )
    yield takeEvery(actionTypes.form.CHANGE, ethTransactionsSagas.formChanged)
  }
}
