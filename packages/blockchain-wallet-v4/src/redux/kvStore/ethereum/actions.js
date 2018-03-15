import * as AT from './actionTypes'

export const updateMetadataEthereum = (payload = {}) => ({ type: AT.UPDATE_METADATA_ETHEREUM, payload })

// FETCH_METADATA_ETHEREUM
export const fetchMetadataEthereum = () => ({ type: AT.FETCH_METADATA_ETHEREUM })
export const fetchMetadataEthereumLoading = () => ({ type: AT.FETCH_METADATA_ETHEREUM_LOADING })
export const fetchMetadataEthereumSuccess = (data) => ({ type: AT.FETCH_METADATA_ETHEREUM_SUCCESS, payload: data })
export const fetchMetadataEthereumFailure = (error) => ({ type: AT.FETCH_METADATA_ETHEREUM_FAILURE, payload: error })

// create
export const createMetadataEthereum = (data) => ({ type: AT.CREATE_METADATA_ETHEREUM, payload: data })

export const setTxNotesEthereum = (txHash, txNote) => ({type: AT.SET_TRANSACTION_NOTE_ETHEREUM, payload: {txHash, txNote}})
