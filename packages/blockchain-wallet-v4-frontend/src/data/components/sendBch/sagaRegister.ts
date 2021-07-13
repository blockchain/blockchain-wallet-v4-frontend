import { actionTypes } from 'redux-form'
import { takeEvery, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const sendBchSagas = sagas({ api, coreSagas, networks })

  return function * sendBchSaga() {
    yield takeLatest(AT.SEND_BCH_INITIALIZED, sendBchSagas.initialized)
    yield takeLatest(AT.SEND_BCH_DESTROYED, sendBchSagas.destroyed)
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
    yield takeLatest(
      AT.SEND_BCH_BITPAY_INVOICE_EXPIRED,
      sendBchSagas.bitpayInvoiceExpired
    )
    yield takeEvery(actionTypes.CHANGE, sendBchSagas.formChanged)
  }
}
