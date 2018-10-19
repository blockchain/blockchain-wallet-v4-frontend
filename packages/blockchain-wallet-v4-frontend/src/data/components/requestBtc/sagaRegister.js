import { takeLatest, takeEvery } from 'redux-saga/effects'
import * as requestAT from './actionTypes'
import { actionTypes } from 'redux-form'
import sagas from './sagas'

export default ({ networks }) => {
  const requestBtcSagas = sagas({ networks })

  return function*() {
    yield takeLatest(
      requestAT.REQUEST_BTC_FIRST_STEP_SUBMIT_CLICKED,
      requestBtcSagas.firstStepSubmitClicked
    )
    yield takeEvery(actionTypes.CHANGE, requestBtcSagas.formChanged)
  }
}
