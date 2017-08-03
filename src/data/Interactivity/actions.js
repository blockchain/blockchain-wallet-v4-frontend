import * as AT from './actionTypes'

export const qrCodeCaptureSuccess = (data) => ({ type: AT.QRCODE_CAPTURE_SUCCESS, payload: { data } })
export const qrCodeCaptureError = (message) => ({ type: AT.QRCODE_CAPTURE_SUCCESS, payload: message })

