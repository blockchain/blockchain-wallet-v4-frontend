import * as AT from './actionTypes'

export const updateMetadataXlm = (payload = {}) => ({
  type: AT.UPDATE_METADATA_XLM,
  payload
})

// FETCH_METADATA_XLM
export const fetchMetadataXlm = () => ({
  type: AT.FETCH_METADATA_XLM
})
export const fetchMetadataXlmLoading = () => ({
  type: AT.FETCH_METADATA_XLM_LOADING
})
export const fetchMetadataXlmSuccess = data => ({
  type: AT.FETCH_METADATA_XLM_SUCCESS,
  payload: data
})
export const fetchMetadataXlmFailure = error => ({
  type: AT.FETCH_METADATA_XLM_FAILURE,
  payload: error
})

// CREATE
export const createMetadataXlm = data => ({
  type: AT.CREATE_METADATA_XLM,
  payload: data
})
export const setTxNotesXlm = (txHash, txNote) => ({
  type: AT.SET_TRANSACTION_NOTE_XLM,
  payload: { txHash, txNote }
})
