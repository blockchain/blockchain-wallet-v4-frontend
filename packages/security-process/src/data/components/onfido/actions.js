import * as AT from './actionTypes'
export const syncOnfido = isSelfie => ({
  type: AT.SYNC_ONFIDO,
  payload: { isSelfie }
})
export const syncOnfidoLoading = () => ({ type: AT.SYNC_ONFIDO_LOADING })
export const syncOnfidoSuccess = () => ({ type: AT.SYNC_ONFIDO_SUCCESS })
export const syncOnfidoError = message => ({
  type: AT.SYNC_ONFIDO_ERROR,
  payload: { message }
})
export const fetchOnfidoSDKKey = () => ({ type: AT.FETCH_ONFIDO_SDK_KEY })
export const fetchOnfidoSDKKeyLoading = () => ({
  type: AT.FETCH_ONFIDO_SDK_KEY_LOADING
})
export const fetchOnfidoSDKKeySuccess = onfidoSDKKey => ({
  type: AT.FETCH_ONFIDO_SDK_KEY_SUCCESS,
  payload: { onfidoSDKKey }
})
export const fetchOnfidoSDKKeyError = message => ({
  type: AT.FETCH_ONFIDO_SDK_KEY_ERROR,
  payload: { message }
})
export const setOnfidoApplicantId = applicantId => ({
  type: AT.SET_ONFIDO_APPLICANT_ID,
  payload: { applicantId }
})
