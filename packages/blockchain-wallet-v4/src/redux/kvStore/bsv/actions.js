import * as AT from './actionTypes'

export const createMetadataBsv = data => ({
  type: AT.CREATE_METADATA_BSV,
  payload: data
})
export const fetchMetadataBsv = () => ({ type: AT.FETCH_METADATA_BSV })
export const fetchMetadataBsvLoading = () => ({
  type: AT.FETCH_METADATA_BSV_LOADING
})
export const fetchMetadataBsvSuccess = data => ({
  type: AT.FETCH_METADATA_BSV_SUCCESS,
  payload: data
})
export const fetchMetadataBsvFailure = error => ({
  type: AT.FETCH_METADATA_BSV_FAILURE,
  payload: error
})
export const setTxNotesBsv = (txHash, txNote) => ({
  type: AT.SET_TRANSACTION_NOTE_BSV,
  payload: { txHash, txNote }
})
export const setAccountArchived = (accountIdx, archived) => ({
  type: AT.SET_BSV_ACCOUNT_ARCHIVED,
  payload: { accountIdx, archived }
})
