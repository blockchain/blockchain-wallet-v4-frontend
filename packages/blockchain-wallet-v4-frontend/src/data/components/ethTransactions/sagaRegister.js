import { takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actionTypes from '../../actionTypes'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const ethTransactionsSagas = sagas({ coreSagas })

  return function * () {
    yield takeEvery(AT.ETH_TRANSACTIONS_INITIALIZED, ethTransactionsSagas.initialized)
    yield takeEvery(actionTypes.form.CHANGE, ethTransactionsSagas.formChanged)
    yield takeEvery(actionTypes.scroll.UPDATE_SCROLL, ethTransactionsSagas.scrollUpdated)
  }
}
