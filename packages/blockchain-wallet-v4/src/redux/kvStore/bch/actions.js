import * as AT from './actionTypes'

// FETCH_METADATA_BCH
export const fetchMetadataBch = () => ({ type: AT.FETCH_METADATA_BCH })
export const fetchMetadataBchLoading = () => ({
  type: AT.FETCH_METADATA_BCH_LOADING
})
export const fetchMetadataBchSuccess = data => ({
  type: AT.FETCH_METADATA_BCH_SUCCESS,
  payload: data
})
export const fetchMetadataBchFailure = error => ({
  type: AT.FETCH_METADATA_BCH_FAILURE,
  payload: error
})

// create
export const createMetadataBch = data => ({
  type: AT.CREATE_METADATA_BCH,
  payload: data
})

export const importLegacyAddress = (key, label) => ({
  type: AT.IMPORT_LEGACY_ADDR_BCH,
  payload: { key, label }
})

export const setLegacyAddress = addr => ({
  type: AT.SET_LEGACY_ADDR_BCH,
  payload: { addr }
})

export const setAccountLabel = (accountIdx, label) => ({
  type: AT.SET_BCH_ACCOUNT_LABEL,
  payload: { accountIdx, label }
})

export const setAccountArchived = (accountIdx, archived) => ({
  type: AT.SET_BCH_ACCOUNT_ARCHIVED,
  payload: { accountIdx, archived }
})

export const setDefaultAccountIdx = index => ({
  type: AT.SET_DEFAULT_BCH_ACCOUNT,
  payload: { index }
})

export const setTxNotesBch = (txHash, txNote) => ({
  type: AT.SET_TRANSACTION_NOTE_BCH,
  payload: { txHash, txNote }
})
