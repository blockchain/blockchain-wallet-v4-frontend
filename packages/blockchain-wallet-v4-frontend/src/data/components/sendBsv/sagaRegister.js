import { takeLatest, takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import { actionTypes } from 'redux-form'
import sagas from './sagas'

export default ({ coreSagas, networks }) => {
  const sendBsvSagas = sagas({ coreSagas, networks })

  return function* sendBsvSaga () {
    yield takeLatest(AT.SEND_BSV_INITIALIZED, sendBsvSagas.initialized)
    yield takeLatest(AT.SEND_BSV_DESTROYED, sendBsvSagas.destroyed)
    yield takeLatest(AT.SEND_BSV_FIRST_STEP_TO_TOGGLED, sendBsvSagas.toToggled)
    yield takeLatest(
      AT.SEND_BSV_FIRST_STEP_MAXIMUM_AMOUNT_CLICKED,
      sendBsvSagas.maximumAmountClicked
    )
    yield takeLatest(
      AT.SEND_BSV_FIRST_STEP_SUBMIT_CLICKED,
      sendBsvSagas.firstStepSubmitClicked
    )
    yield takeLatest(
      AT.SEND_BSV_SECOND_STEP_SUBMIT_CLICKED,
      sendBsvSagas.secondStepSubmitClicked
    )
    yield takeEvery(actionTypes.CHANGE, sendBsvSagas.formChanged)
  }
}
