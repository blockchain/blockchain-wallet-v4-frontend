import * as AT from './actionTypes'

export const fetchVeriffUrl = () => ({ type: AT.FETCH_VERIFF_URL })
export const fetchVeriffUrlLoading = () => ({
  type: AT.FETCH_VERIFF_URL_LOADING
})
export const fetchVeriffUrlSuccess = (veriffUrl) => ({
  payload: { veriffUrl },
  type: AT.FETCH_VERIFF_URL_SUCCESS
})
export const fetchVeriffUrlError = (message) => ({
  payload: { message },
  type: AT.FETCH_VERIFF_URL_ERROR
})

export const setApplicantId = (applicantId) => ({
  payload: { applicantId },
  type: AT.SET_APPLICANT_ID
})

export const syncVeriff = () => ({
  type: AT.SYNC_VERIFF
})
