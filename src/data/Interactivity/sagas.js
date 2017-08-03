import { takeEvery, take, put } from 'redux-saga/effects'
import { actions as reduxFormActions } from 'redux-form'
import { push } from 'react-router-redux'
import { actions, actionTypes } from 'data'
import * as AT from './actionTypes'

// =============================================================================
// =========================== QrCodeCapture modal =============================
// =============================================================================

const qrCodeCaptureSuccess = function * (action) {
  const { payload } = action
  const { data } = payload

  if (data) {
    yield put(actions.alerts.displaySuccess(data))
    yield put(reduxFormActions.change('sendBitcoin', 'to', data))
    yield put(actions.modals.closeModal())
  }
}

const qrCodeCaptureError = function * (action) {
  const { payload } = action
  yield put(actions.alerts.displayError(payload))
  yield put(actions.modals.closeModal())
}

// =============================================================================
// ============================ SendBitcoin modal ==============================
// =============================================================================

const signAndPublishSuccess = function * (action) {
  yield put(reduxFormActions.destroy('sendBitcoin'))
  yield put(actions.modals.closeModal())
  yield put(push('/transactions'))
  yield put(actions.alerts.displaySuccess('Your transaction is being confirmed'))
}

const signAndPublishError = function * (action) {
  const { payload } = action
  yield put(actions.alerts.displayError(payload))
}

// =============================== EXPORT ======================================

function * sagas () {
  yield takeEvery(AT.QRCODE_CAPTURE_SUCCESS, qrCodeCaptureSuccess)
  yield takeEvery(AT.QRCODE_CAPTURE_ERROR, qrCodeCaptureError)
  yield takeEvery(actionTypes.core.payment.SIGN_AND_PUBLISH_SUCCESS, signAndPublishSuccess)
  yield takeEvery(actionTypes.core.payment.SIGN_AND_PUBLISH_ERROR, signAndPublishError)
}

export default sagas
