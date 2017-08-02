import { take, put, race } from 'redux-saga/effects'
import { closeModal, showModalQRCodeCapture } from './actions'
import * as AT from './actionTypes'
import * as alerts from '../Alerts/actions'

export const readQrCode = function * () {
  yield put(showModalQRCodeCapture())

  let { success, error } = yield race({
    success: take(AT.CAPTURE_QR_SUCCESS),
    error: take(AT.CAPTURE_QR_ERROR)
  })

  yield put(closeModal())

  if (success) return success.payload
  else throw new Error(error.payload)
}

export const readQrAndAlert = function * () {
  try {
    let result = yield readQrCode()
    yield put(alerts.displaySuccess(result))
  } catch (error) {
    yield put(alerts.displayError(error.message))
  }
}
