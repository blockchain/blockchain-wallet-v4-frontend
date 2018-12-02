// FETCH_METADATA_BTC
import * as AT from './actionTypes'

export const fetchMetadataBtc = () => ({ type: AT.FETCH_METADATA_BTC })
export const fetchMetadataBtcLoading = () => ({
  type: AT.FETCH_METADATA_BTC_LOADING
})
export const fetchMetadataBtcSuccess = data => ({
  type: AT.FETCH_METADATA_BTC_SUCCESS,
  payload: data
})
export const fetchMetadataBtcFailure = error => ({
  type: AT.FETCH_METADATA_BTC_FAILURE,
  payload: error
})

// create
export const createMetadataBtc = data => ({
  type: AT.CREATE_METADATA_BTC,
  payload: data
})

export const addAddressLabel = (address, label) => ({
  type: AT.ADD_ADDRESS_LABEL,
  payload: { address, label }
})
