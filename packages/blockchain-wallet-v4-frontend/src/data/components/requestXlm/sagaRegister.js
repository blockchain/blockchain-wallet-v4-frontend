import * as requestAT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default () => {
  const requestXlmSagas = sagas()

  return function * requestXlmSaga () {
    yield takeLatest(
      requestAT.OPEN_LOCKBOX_APP_CLICKED,
      requestXlmSagas.openLockboxAppClicked
    )
  }
}
