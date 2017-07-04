import * as T from './actionTypes'

export const fetchBlockchainData = (walletContext) =>
  ({ type: T.FETCH_BLOCKCHAIN_DATA, payload: walletContext })
export const fetchBlockchainDataSuccess = (data) =>
  ({ type: T.FETCH_BLOCKCHAIN_DATA_SUCCESS, payload: data })
export const fetchBlockchainDataError = (errorKey) =>
  ({ type: T.FETCH_BLOCKCHAIN_DATA_ERROR, payload: errorKey, error: true })
