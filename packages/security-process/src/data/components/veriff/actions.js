import * as AT from './actionTypes'

export const fetchVeriffUrl = () => ({ type: AT.FETCH_VERIFF_URL })
export const fetchVeriffUrlLoading = () => ({
  type: AT.FETCH_VERIFF_URL_LOADING
})
export const fetchVeriffUrlSuccess = veriffUrl => ({
  type: AT.FETCH_VERIFF_URL_SUCCESS,
  payload: { veriffUrl }
})
export const fetchVeriffUrlError = message => ({
  type: AT.FETCH_VERIFF_URL_ERROR,
  payload: { message }
})

export const setApplicantId = applicantId => ({
  type: AT.SET_APPLICANT_ID,
  payload: { applicantId }
})

export const syncVeriff = () => ({
  type: AT.SYNC_VERIFF
})
