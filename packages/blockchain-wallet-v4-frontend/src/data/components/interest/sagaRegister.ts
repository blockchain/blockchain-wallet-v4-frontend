import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default () => {
  const interestSagas = sagas()

  return function* interestSaga() {
    yield takeLatest(AT.INITIALIZE_INTEREST, interestSagas.initializeInterest)
  }
}
