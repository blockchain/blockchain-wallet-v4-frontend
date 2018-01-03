import * as AT from './actionTypes'

export const fetchMetadataEthereum = () => ({ type: AT.FETCH_METADATA_ETHEREUM })

export const fetchMetadataEthereumSuccess = (data) => ({ type: AT.FETCH_METADATA_ETHEREUM_SUCCESS, payload: data })

export const fetchMetadataEthereumFailure = (error) => ({ type: AT.FETCH_METADATA_ETHEREUM_FAILURE, payload: error })
