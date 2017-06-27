import * as T from './actionTypes'

export const error = (error) =>
  ({ type: T.ERROR, payload: error, error: true })
export const requestWalletData = (walletContext) =>
  ({ type: T.WALLET_DATA_REQUEST, payload: walletContext })
