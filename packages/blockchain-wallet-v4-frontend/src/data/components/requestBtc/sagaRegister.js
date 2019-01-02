import { takeLatest } from 'redux-saga/effects'
import * as requestAT from './actionTypes'
import sagas from './sagas'

export default ({ networks }) => {
  const requestBtcSagas = sagas({ networks })

  return function* requestBtcSaga () {
    yield takeLatest(
      requestAT.REQUEST_BTC_FIRST_STEP_SUBMIT_CLICKED,
      requestBtcSagas.firstStepSubmitClicked
    )
    yield takeLatest(
      requestAT.OPEN_LOCKBOX_APP_CLICKED,
      requestBtcSagas.openLockboxAppClicked
    )
  }
}
