import * as AT from './actionTypes'

// METADATA
export const createMetadataBuySell = data => ({
  type: AT.CREATE_METADATA_BUYSELL,
  payload: data
})

export const fetchMetadataBuySell = () => ({ type: AT.FETCH_METADATA_BUYSELL })
export const fetchMetadataBuySellLoading = () => ({
  type: AT.FETCH_METADATA_BUYSELL_LOADING
})
export const fetchMetadataBuySellSuccess = data => ({
  type: AT.FETCH_METADATA_BUYSELL_SUCCESS,
  payload: data
})
export const fetchMetadataBuySellFailure = error => ({
  type: AT.FETCH_METADATA_BUYSELL_FAILURE,
  payload: error
})

export const updateMetadataBuySell = (payload = {}) => ({
  type: AT.UPDATE_METADATA_BUYSELL,
  payload
})
export const wipeExternal = () => ({ type: AT.WIPE_EXTERNAL })
