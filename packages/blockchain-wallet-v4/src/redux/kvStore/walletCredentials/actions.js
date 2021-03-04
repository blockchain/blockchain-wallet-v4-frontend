import * as AT from './actionTypes'

export const fetchMetadataWalletCredentials = () => ({
  type: AT.FETCH_METADATA_WALLET_CREDENTIALS
})
export const fetchMetadataWalletCredentialsLoading = () => ({
  type: AT.FETCH_METADATA_WALLET_CREDENTIALS_LOADING
})
export const fetchMetadataWalletCredentialsSuccess = data => ({
  type: AT.FETCH_METADATA_WALLET_CREDENTIALS_SUCCESS,
  payload: data
})
export const fetchMetadataWalletCredentialsFailure = error => ({
  type: AT.FETCH_METADATA_WALLET_CREDENTIALS_FAILURE,
  payload: error
})
export const createMetadataWalletCredentials = data => ({
  type: AT.CREATE_METADATA_WALLET_CREDENTIALS,
  payload: data
})

export const setWalletCredentials = (guid, sharedKey, password) => ({
  type: AT.SET_WALLET_CREDENTIALS,
  payload: { guid, sharedKey, password }
})
