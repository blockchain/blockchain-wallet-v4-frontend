import * as AT from './actionTypes'

// FETCH_METADATA_ETHEREUM
export const fetchMetadataEthereum = () => ({ type: AT.FETCH_METADATA_ETHEREUM })
export const fetchMetadataEthereumLoading = () => ({ type: AT.FETCH_METADATA_ETHEREUM_LOADING })
export const fetchMetadataEthereumSuccess = (data) => ({ type: AT.FETCH_METADATA_ETHEREUM_SUCCESS, payload: data })
export const fetchMetadataEthereumFailure = (error) => ({ type: AT.FETCH_METADATA_ETHEREUM_FAILURE, payload: error })
