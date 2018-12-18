import { takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actionTypes from '../../actionTypes'
import sagas from './sagas'

export default () => {
  const bsvTransactionsSagas = sagas()

  return function*() {
    yield takeEvery(
      AT.BSV_TRANSACTIONS_INITIALIZED,
      bsvTransactionsSagas.initialized
    )
    yield takeEvery(actionTypes.form.CHANGE, bsvTransactionsSagas.formChanged)
    yield takeEvery(
      actionTypes.scroll.UPDATE_SCROLL,
      bsvTransactionsSagas.scrollUpdated
    )
  }
}
