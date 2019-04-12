import * as AT from './actionTypes'

export const updateMetadataEth = (payload = {}) => ({
  type: AT.UPDATE_METADATA_ETH,
  payload
})

// FETCH_METADATA_ETH
export const fetchMetadataEth = () => ({
  type: AT.FETCH_METADATA_ETH
})
export const fetchMetadataEthLoading = () => ({
  type: AT.FETCH_METADATA_ETH_LOADING
})
export const fetchMetadataEthSuccess = data => ({
  type: AT.FETCH_METADATA_ETH_SUCCESS,
  payload: data
})
export const fetchMetadataEthFailure = error => ({
  type: AT.FETCH_METADATA_ETH_FAILURE,
  payload: error
})

// create
export const createMetadataEth = data => ({
  type: AT.CREATE_METADATA_ETH,
  payload: data
})
export const setTxNotesEth = (txHash, txNote) => ({
  type: AT.SET_TRANSACTION_NOTE_ETH,
  payload: { txHash, txNote }
})
export const setTxNotesErc20 = (token, txHash, txNote) => ({
  type: AT.SET_TRANSACTION_NOTE_ERC20,
  payload: { token, txHash, txNote }
})
export const setLatestTxEth = txHash => ({
  type: AT.SET_LATEST_TX_ETH,
  payload: txHash
})
export const setLatestTxTimestampEth = timestamp => ({
  type: AT.SET_LATEST_TX_TIMESTAMP_ETH,
  payload: timestamp
})
export const setErc20HasSeen = token => ({
  type: AT.SET_ERC0_HAS_SEEN,
  payload: { token }
})
