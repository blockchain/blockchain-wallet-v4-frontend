import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import { actionTypes } from 'redux-form'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const sendXlmSagas = sagas({ coreSagas })

  return function* sendXlmSaga () {
    yield takeLatest(AT.INITIALIZED, sendXlmSagas.initialized)
    yield takeLatest(AT.DESTROYED, sendXlmSagas.destroyed)
    yield takeLatest(AT.FIRST_STEP_TO_TOGGLED, sendXlmSagas.toToggled)
    yield takeLatest(
      AT.FIRST_STEP_SUBMIT_CLICKED,
      sendXlmSagas.firstStepSubmitClicked
    )
    yield takeLatest(
      AT.FIRST_STEP_MAXIMUM_AMOUNT_CLICKED,
      sendXlmSagas.maximumAmountClicked
    )
    yield takeLatest(
      AT.SECOND_STEP_SUBMIT_CLICKED,
      sendXlmSagas.secondStepSubmitClicked
    )
    yield takeLatest(actionTypes.CHANGE, sendXlmSagas.formChanged)
  }
}
