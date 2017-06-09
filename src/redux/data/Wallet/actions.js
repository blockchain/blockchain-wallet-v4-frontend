export const WALLET_DATA_LOAD = '@v3.WALLET_DATA_LOAD'

export const loadWalletData = (data) =>
  ({ type: WALLET_DATA_LOAD, payload: data })
