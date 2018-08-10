import * as AT from './actionTypes'

export const fetchMetadataUserCredentials = () => ({
  type: AT.FETCH_METADATA_USER_CREDENTIALS
})
export const fetchMetadataUserCredentialsLoading = () => ({
  type: AT.FETCH_METADATA_USER_CREDENTIALS_LOADING
})
export const fetchMetadataUserCredentialsSuccess = data => ({
  type: AT.FETCH_METADATA_USER_CREDENTIALS_SUCCESS,
  payload: data
})
export const fetchMetadataUserCredentialsFailure = error => ({
  type: AT.FETCH_METADATA_USER_CREDENTIALS_FAILURE,
  payload: error
})
export const createMetadataUserCredentials = data => ({
  type: AT.CREATE_METADATA_USER_CREDENTIALS,
  payload: data
})

export const setUserId = userId => ({
  type: AT.SET_USER_ID,
  payload: { userId }
})
export const setUserToken = token => ({
  type: AT.SET_USER_TOKEN,
  payload: { token }
})
