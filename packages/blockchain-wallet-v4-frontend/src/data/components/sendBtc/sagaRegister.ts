import { actionTypes } from 'redux-form'
import { takeEvery, takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const sendBtcSagas = sagas({ api, coreSagas, networks })

  return function * sendBtcSaga() {
    yield takeLatest(AT.SEND_BTC_INITIALIZED, sendBtcSagas.initialized)
    yield takeLatest(AT.SEND_BTC_DESTROYED, sendBtcSagas.destroyed)
    yield takeLatest(
      AT.SEND_BTC_FIRST_STEP_MINIMUM_AMOUNT_CLICKED,
      sendBtcSagas.minimumAmountClicked
    )
    yield takeLatest(
      AT.SEND_BTC_FIRST_STEP_MAXIMUM_AMOUNT_CLICKED,
      sendBtcSagas.maximumAmountClicked
    )
    yield takeLatest(
      AT.SEND_BTC_FIRST_STEP_MINIMUM_FEE_CLICKED,
      sendBtcSagas.minimumFeeClicked
    )
    yield takeLatest(
      AT.SEND_BTC_FIRST_STEP_MAXIMUM_FEE_CLICKED,
      sendBtcSagas.maximumFeeClicked
    )
    yield takeLatest(
      AT.SEND_BTC_FIRST_STEP_REGULAR_FEE_CLICKED,
      sendBtcSagas.regularFeeClicked
    )
    yield takeLatest(
      AT.SEND_BTC_FIRST_STEP_PRIORITY_FEE_CLICKED,
      sendBtcSagas.priorityFeeClicked
    )
    yield takeLatest(
      AT.SEND_BTC_FIRST_STEP_SUBMIT_CLICKED,
      sendBtcSagas.firstStepSubmitClicked
    )
    yield takeLatest(
      AT.SEND_BTC_SECOND_STEP_SUBMIT_CLICKED,
      sendBtcSagas.secondStepSubmitClicked
    )
    yield takeLatest(
      AT.SEND_BTC_BITPAY_INVOICE_EXPIRED,
      sendBtcSagas.bitpayInvoiceExpired
    )
    yield takeEvery(actionTypes.CHANGE, sendBtcSagas.formChanged)
  }
}
