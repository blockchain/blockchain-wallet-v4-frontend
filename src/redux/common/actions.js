export const WALLET_DATA_REQUEST = '@v3.WALLET_DATA_REQUEST'
export const ERROR = '@v3.ERROR'

export const error = (error) =>
  ({ type: ERROR, payload: error, error: true })
export const requestWalletData = (walletContext) =>
  ({ type: WALLET_DATA_REQUEST, payload: walletContext })
