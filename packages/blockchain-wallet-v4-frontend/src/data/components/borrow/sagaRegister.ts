import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const borrowSagas = sagas({ api, coreSagas, networks })

  return function * borrowSaga () {
    yield takeLatest(AT.INITIALIZE_BORROW, borrowSagas.initializeBorrow)
  }
}
