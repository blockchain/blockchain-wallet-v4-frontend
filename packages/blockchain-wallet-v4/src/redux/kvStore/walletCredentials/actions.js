import * as AT from './actionTypes'

export const fetchMetadataWalletCredentials = () => ({
  type: AT.FETCH_METADATA_WALLET_CREDENTIALS
})
export const fetchMetadataWalletCredentialsLoading = () => ({
  type: AT.FETCH_METADATA_WALLET_CREDENTIALS_LOADING
})
export const fetchMetadataWalletCredentialsSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_METADATA_WALLET_CREDENTIALS_SUCCESS
})
export const fetchMetadataWalletCredentialsFailure = (error) => ({
  payload: error,
  type: AT.FETCH_METADATA_WALLET_CREDENTIALS_FAILURE
})
export const createMetadataWalletCredentials = (data) => ({
  payload: data,
  type: AT.CREATE_METADATA_WALLET_CREDENTIALS
})

export const setWalletCredentials = (guid, sharedKey, password) => ({
  payload: { guid, password, sharedKey },
  type: AT.SET_WALLET_CREDENTIALS
})
