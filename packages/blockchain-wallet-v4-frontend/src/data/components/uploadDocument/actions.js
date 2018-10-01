import * as AT from './actionTypes'

export const upload = (token, file) => ({
  type: AT.UPLOAD,
  payload: { file, token }
})
export const uploadLoading = () => ({ type: AT.UPLOAD_LOADING })
export const uploadSuccess = () => ({ type: AT.UPLOAD_SUCCESS })
export const uploadError = message => ({
  type: AT.UPLOAD_ERROR,
  payload: { message }
})
