import * as AT from './actionTypes'

// CREATE
export const createMetadataUnifiedCredentials = (data) => ({
  payload: data,
  type: AT.CREATE_METADATA_UNIFIED_CREDENTIALS
})

// FETCH
export const fetchMetadataUnifiedCredentials = () => ({
  type: AT.FETCH_METADATA_UNIFIED_CREDENTIALS
})
export const fetchMetadataUnifiedCredentialsLoading = () => ({
  type: AT.FETCH_METADATA_UNIFIED_CREDENTIALS_LOADING
})
export const fetchMetadataUnifiedCredentialsSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_METADATA_UNIFIED_CREDENTIALS_SUCCESS
})
export const fetchMetadataUnifiedCredentialsFailure = (error) => ({
  payload: error,
  type: AT.FETCH_METADATA_UNIFIED_CREDENTIALS_FAILURE
})

// UPDATE
export const setUnifiedCredentials = ({
  exchange_lifetime_token,
  exchange_user_id,
  nabu_lifetime_token,
  nabu_user_id
}) => ({
  payload: { exchange_lifetime_token, exchange_user_id, nabu_lifetime_token, nabu_user_id },
  type: AT.SET_UNIFIED_CREDENTIALS
})
