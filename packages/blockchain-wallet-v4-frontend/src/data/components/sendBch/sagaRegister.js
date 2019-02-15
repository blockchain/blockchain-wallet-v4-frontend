import { takeLatest, takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import { actionTypes } from 'redux-form'
import sagas from './sagas'

export default ({ coreSagas, networks }) => {
  const sendBchSagas = sagas({ coreSagas, networks })

  return function* sendBchSaga () {
    yield takeLatest(AT.SEND_BCH_INITIALIZED, sendBchSagas.initialized)
    yield takeLatest(AT.SEND_BCH_DESTROYED, sendBchSagas.destroyed)
    yield takeLatest(AT.SEND_BCH_FIRST_STEP_TO_TOGGLED, sendBchSagas.toToggled)
    yield takeLatest(
      AT.SEND_BCH_FIRST_STEP_MAXIMUM_AMOUNT_CLICKED,
      sendBchSagas.maximumAmountClicked
    )
    yield takeLatest(
      AT.SEND_BCH_FIRST_STEP_SUBMIT_CLICKED,
      sendBchSagas.firstStepSubmitClicked
    )
    yield takeLatest(
      AT.SEND_BCH_SECOND_STEP_SUBMIT_CLICKED,
      sendBchSagas.secondStepSubmitClicked
    )
    yield takeEvery(actionTypes.CHANGE, sendBchSagas.formChanged)
  }
}
