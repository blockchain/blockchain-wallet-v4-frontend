import * as AT from './actionTypes'

export const fetchData = token => ({
  type: AT.FETCH_DATA,
  payload: { token }
})

export const upload = (token, files, redirectUrl) => ({
  type: AT.UPLOAD,
  payload: { files, token, redirectUrl }
})

export const setReference = reference => ({
  type: AT.SET_REFERENCE,
  payload: { reference }
})

export const setData = data => ({
  type: AT.SET_DATA,
  payload: { data }
})

export const setUploadedLoading = () => {
  return { type: AT.SET_UPLOADED_LOADING }
}

export const setUploadedSuccess = payload => {
  return { type: AT.SET_UPLOADED_SUCCESS, payload }
}

export const setUploadedFailure = payload => {
  return { type: AT.SET_UPLOADED_FAILURE, payload }
}
