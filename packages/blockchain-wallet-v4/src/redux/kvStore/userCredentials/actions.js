import * as AT from './actionTypes'

export const fetchMetadataUserCredentials = () => ({
  type: AT.FETCH_METADATA_USER_CREDENTIALS
})
export const fetchMetadataUserCredentialsLoading = () => ({
  type: AT.FETCH_METADATA_USER_CREDENTIALS_LOADING
})
export const fetchMetadataUserCredentialsSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_METADATA_USER_CREDENTIALS_SUCCESS
})
export const fetchMetadataUserCredentialsFailure = (error) => ({
  payload: error,
  type: AT.FETCH_METADATA_USER_CREDENTIALS_FAILURE
})
export const createMetadataUserCredentials = (data) => ({
  payload: data,
  type: AT.CREATE_METADATA_USER_CREDENTIALS
})

export const setUserCredentials = (user_id, lifetime_token) => ({
  payload: { lifetime_token, user_id },
  type: AT.SET_USER_CREDENTIALS
})

export const setExchangeUserCredentials = (exchange_user_id, exchange_lifetime_token) => ({
  payload: { exchange_lifetime_token, exchange_user_id },
  type: AT.SET_EXCHANGE_USER_CREDENTIALS
})

export const setUnifiedAccountCredentials = (
  user_id,
  lifetime_token,
  exchange_user_id,
  exchange_lifetime_token
) => ({
  payload: { exchange_lifetime_token, exchange_user_id, lifetime_token, user_id },
  type: AT.SET_UNIFIED_ACCOUNT_RESET_CREDENTIALS
})
