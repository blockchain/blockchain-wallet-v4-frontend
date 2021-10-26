// FETCH_METADATA_BTC
import * as AT from './actionTypes'

export const fetchMetadataBtc = () => ({ type: AT.FETCH_METADATA_BTC })
export const fetchMetadataBtcLoading = () => ({
  type: AT.FETCH_METADATA_BTC_LOADING
})
export const fetchMetadataBtcSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_METADATA_BTC_SUCCESS
})
export const fetchMetadataBtcFailure = (error) => ({
  payload: error,
  type: AT.FETCH_METADATA_BTC_FAILURE
})

// create
export const createMetadataBtc = (data) => ({
  payload: data,
  type: AT.CREATE_METADATA_BTC
})

export const addAddressLabel = (address, label) => ({
  payload: { address, label },
  type: AT.ADD_ADDRESS_LABEL
})
