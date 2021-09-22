import * as AT from './actionTypes'

export const fetchData = (token) => ({
  payload: { token },
  type: AT.FETCH_DATA
})

export const upload = (token, files, redirectUrl) => ({
  payload: { files, redirectUrl, token },
  type: AT.UPLOAD
})

export const setReference = (reference) => ({
  payload: { reference },
  type: AT.SET_REFERENCE
})

export const setData = (data) => ({
  payload: { data },
  type: AT.SET_DATA
})

export const setUploadedLoading = () => {
  return { type: AT.SET_UPLOADED_LOADING }
}

export const setUploadedSuccess = (payload) => {
  return { payload, type: AT.SET_UPLOADED_SUCCESS }
}

export const setUploadedFailure = (payload) => {
  return { payload, type: AT.SET_UPLOADED_FAILURE }
}
