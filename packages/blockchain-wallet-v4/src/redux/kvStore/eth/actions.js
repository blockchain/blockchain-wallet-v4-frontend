import * as AT from './actionTypes'

export const updateMetadataEth = (payload = {}) => ({
  payload,
  type: AT.UPDATE_METADATA_ETH
})

// FETCH_METADATA_ETH
export const fetchMetadataEth = () => ({
  type: AT.FETCH_METADATA_ETH
})
export const fetchMetadataEthLoading = () => ({
  type: AT.FETCH_METADATA_ETH_LOADING
})
export const fetchMetadataEthSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_METADATA_ETH_SUCCESS
})
export const fetchMetadataEthFailure = (error) => ({
  payload: error,
  type: AT.FETCH_METADATA_ETH_FAILURE
})

// create
export const createMetadataEth = (data) => ({
  payload: data,
  type: AT.CREATE_METADATA_ETH
})
export const setTxNotesEth = (txHash, txNote) => ({
  payload: { txHash, txNote },
  type: AT.SET_TRANSACTION_NOTE_ETH
})
export const setTxNotesErc20 = (token, txHash, txNote) => ({
  payload: { token, txHash, txNote },
  type: AT.SET_TRANSACTION_NOTE_ERC20
})
export const setLatestTxEth = (txHash) => ({
  payload: txHash,
  type: AT.SET_LATEST_TX_ETH
})
export const setLatestTxTimestampEth = (timestamp) => ({
  payload: timestamp,
  type: AT.SET_LATEST_TX_TIMESTAMP_ETH
})
export const setErc20HasSeen = (token) => ({
  payload: { token },
  type: AT.SET_ERC0_HAS_SEEN
})
