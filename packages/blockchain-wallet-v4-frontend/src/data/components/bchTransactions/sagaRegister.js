import { takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actionTypes from '../../actionTypes'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const bchTransactionsSagas = sagas({ coreSagas })

  return function * () {
    yield takeEvery(AT.BCH_TRANSACTIONS_INITIALIZED, bchTransactionsSagas.initialized)
    yield takeEvery(actionTypes.form.CHANGE, bchTransactionsSagas.formChanged)
    yield takeEvery(actionTypes.scroll.UPDATE_SCROLL, bchTransactionsSagas.scrollUpdated)
  }
}
