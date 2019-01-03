import { takeLatest } from 'redux-saga/effects'
import * as requestAT from './actionTypes'
import sagas from './sagas'

export default ({ networks }) => {
  const requestBchSagas = sagas({ networks })

  return function* requestBchSaga () {
    yield takeLatest(
      requestAT.OPEN_LOCKBOX_APP_CLICKED,
      requestBchSagas.openLockboxAppClicked
    )
  }
}
