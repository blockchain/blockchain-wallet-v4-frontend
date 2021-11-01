import * as AT from './actionTypes'

export const updateMetadataXlm = (payload = {}) => ({
  payload,
  type: AT.UPDATE_METADATA_XLM
})

// FETCH_METADATA_XLM
export const fetchMetadataXlm = () => ({
  type: AT.FETCH_METADATA_XLM
})
export const fetchMetadataXlmLoading = () => ({
  type: AT.FETCH_METADATA_XLM_LOADING
})
export const fetchMetadataXlmSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_METADATA_XLM_SUCCESS
})
export const fetchMetadataXlmFailure = (error) => ({
  payload: error,
  type: AT.FETCH_METADATA_XLM_FAILURE
})

// CREATE
export const createMetadataXlm = (data) => ({
  payload: data,
  type: AT.CREATE_METADATA_XLM
})
export const setTxNotesXlm = (txHash, txNote) => ({
  payload: { txHash, txNote },
  type: AT.SET_TRANSACTION_NOTE_XLM
})
