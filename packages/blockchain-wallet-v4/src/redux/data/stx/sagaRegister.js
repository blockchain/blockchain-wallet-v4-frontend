import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default () => {
  const dataStxSagas = sagas()

  return function * coreDataXlmSaga () {
    yield takeLatest(AT.GENERATE_ADDRESS, dataStxSagas.generateAddress)
  }
}
