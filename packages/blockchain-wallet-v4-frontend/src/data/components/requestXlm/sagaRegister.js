import { takeLatest } from 'redux-saga/effects'
import * as requestAT from './actionTypes'
import sagas from './sagas'

export default () => {
  const requestXlmSagas = sagas()

  return function*() {
    yield takeLatest(
      requestAT.OPEN_LOCKBOX_APP_CLICKED,
      requestXlmSagas.openLockboxAppClicked
    )
  }
}
