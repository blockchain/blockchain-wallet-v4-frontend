import * as AT from './actionTypes'

// FETCH_METADATA_BCH
export const fetchMetadataBch = () => ({ type: AT.FETCH_METADATA_BCH })
export const fetchMetadataBchLoading = () => ({
  type: AT.FETCH_METADATA_BCH_LOADING
})
export const fetchMetadataBchSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_METADATA_BCH_SUCCESS
})
export const fetchMetadataBchFailure = (error) => ({
  payload: error,
  type: AT.FETCH_METADATA_BCH_FAILURE
})

// create
export const createMetadataBch = (data) => ({
  payload: data,
  type: AT.CREATE_METADATA_BCH
})

export const importLegacyAddress = (key, label) => ({
  payload: { key, label },
  type: AT.IMPORT_LEGACY_ADDR_BCH
})

export const setLegacyAddress = (addr) => ({
  payload: { addr },
  type: AT.SET_LEGACY_ADDR_BCH
})

export const setAccountLabel = (accountIdx, label) => ({
  payload: { accountIdx, label },
  type: AT.SET_BCH_ACCOUNT_LABEL
})

export const setAccountArchived = (accountIdx, archived) => ({
  payload: { accountIdx, archived },
  type: AT.SET_BCH_ACCOUNT_ARCHIVED
})

export const setDefaultAccountIdx = (index) => ({
  payload: { index },
  type: AT.SET_DEFAULT_BCH_ACCOUNT
})

export const setTxNotesBch = (txHash, txNote) => ({
  payload: { txHash, txNote },
  type: AT.SET_TRANSACTION_NOTE_BCH
})
