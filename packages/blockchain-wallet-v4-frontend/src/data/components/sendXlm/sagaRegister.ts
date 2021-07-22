import { actionTypes } from 'redux-form'
import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const sendXlmSagas = sagas({ api, coreSagas, networks })

  return function* sendXlmSaga() {
    yield takeLatest(AT.SEND_XLM_INITIALIZED, sendXlmSagas.initialized)
    yield takeLatest(AT.SEND_XLM_DESTROYED, sendXlmSagas.destroyed)
    yield takeLatest(AT.SEND_XLM_FIRST_STEP_SUBMIT_CLICKED, sendXlmSagas.firstStepSubmitClicked)
    yield takeLatest(
      AT.SEND_XLM_FIRST_STEP_MAXIMUM_AMOUNT_CLICKED,
      sendXlmSagas.maximumAmountClicked
    )
    yield takeLatest(AT.SEND_XLM_SECOND_STEP_SUBMIT_CLICKED, sendXlmSagas.secondStepSubmitClicked)
    yield takeLatest(
      // @ts-ignore
      AT.SEND_XLM_CHECK_DESTINATION_ACCOUNT_EXISTS,
      sendXlmSagas.checkDestinationAccountExists
    )
    yield takeLatest(
      // @ts-ignore
      AT.SEND_XLM_CHECK_IF_DESTINATION_IS_EXCHANGE,
      sendXlmSagas.checkIfDestinationIsExchange
    )
    yield takeLatest(actionTypes.CHANGE, sendXlmSagas.formChanged)
  }
}
