export const ADDRESS_ADD = '@v3.ADDRESS_ADD'
export const ADDRESS_LABEL = '@v3.ADDRESS_LABEL'
export const WALLET_REPLACE = '@v3.WALLET_REPLACE'
export const WALLET_CLEAR = '@v3.WALLET_CLEAR'
export const SECOND_PASSWORD_ON = '@v3.SECOND_PASSWORD_ON'
export const SECOND_PASSWORD_OFF = '@v3.SECOND_PASSWORD_OFF'
export const MAIN_PASSWORD_CHANGE = '@v3.MAIN_PASSWORD_CHANGE'
export const PAYLOAD_CHECKSUM_CHANGE = '@v3.PAYLOAD_CHECKSUM_CHANGE'

export const WALLET_DATA_REQUEST = '@v3.WALLET_DATA_REQUEST'
export const WALLET_DATA_LOAD = '@v3.WALLET_DATA_LOAD'
export const LATEST_BLOCK_DATA_LOAD = '@v3.LATEST_BLOCK_DATA_LOAD'
export const ADDRESSES_DATA_LOAD = '@v3.ADDRESSES_DATA_LOAD'

export const CONTEXT_TXS_LOAD = '@v3.CONTEXT_TXS_LOAD'
export const TXS_LOAD_REQUEST = '@v3.TXS_LOAD_REQUEST'
export const CONTEXT_TXS_CLEAR = '@v3.CONTEXT_TXS_CLEAR'
export const SYNC_START = '@v3.SYNC_START'
export const SYNC_SUCCESS = '@v3.SYNC_SUCCESS'
export const SYNC_ERROR = '@v3.SYNC_ERROR'
export const WALLET_NEW = '@v3.WALLET_NEW'
export const WALLET_NEW_FAILURE = '@v3.WALLET_NEW_FAILURE'
export const WALLET_NEW_SUCCESS = '@v3.WALLET_NEW_SUCCESS'
export const WALLET_NEW_SET = '@v3.WALLET_NEW_SET'

export const addAddress = (address, secondPassword) =>
  ({ type: ADDRESS_ADD, payload: {address, secondPassword} })
export const addLabel = (address, label) =>
  ({ type: ADDRESS_LABEL, payload: {address, label} })
export const replaceWallet = (payload) =>
  ({ type: WALLET_REPLACE, payload: payload })
export const clearWallet = () =>
  ({ type: WALLET_CLEAR })
export const secondPasswordOn = (newWallet) =>
  ({ type: SECOND_PASSWORD_ON, payload: newWallet })
export const secondPasswordOff = (newWallet) =>
  ({ type: SECOND_PASSWORD_OFF, payload: newWallet })
export const changeMainPassword = (password) =>
  ({ type: MAIN_PASSWORD_CHANGE, payload: password })
export const changePayloadChecksum = (checksum) =>
  ({ type: PAYLOAD_CHECKSUM_CHANGE, payload: checksum })
export const loadWalletData = (data) =>
  ({ type: WALLET_DATA_LOAD, payload: data })
export const loadLatestBlockData = (data) =>
  ({ type: LATEST_BLOCK_DATA_LOAD, payload: data })
export const loadaddressesData = (data) =>
  ({ type: ADDRESSES_DATA_LOAD, payload: data })
export const requestWalletData = (walletContext) =>
  ({ type: WALLET_DATA_REQUEST, payload: walletContext })
export const loadContextTxs = (data) =>
  ({ type: CONTEXT_TXS_LOAD, payload: data })
export const requestTxs = (context) =>
  ({ type: TXS_LOAD_REQUEST, payload: context })
export const clearTxs = (context) =>
  ({ type: CONTEXT_TXS_CLEAR, payload: context })
export const syncStart = () =>
  ({ type: SYNC_START })
export const syncSuccess = (checksum) =>
  ({ type: SYNC_SUCCESS, payload: checksum })
export const syncError = (error) =>
  ({ type: SYNC_ERROR, payload: error, error: true })
export const newWallet = (password, email) =>
  ({ type: WALLET_NEW, payload: { password, email } })
export const setNewWallet = (guid, sharedKey, mnemonic) =>
  ({ type: WALLET_NEW_SET, payload: { guid, sharedKey, mnemonic } })
export const newWalletSuccess = () =>
  ({ type: WALLET_NEW_SUCCESS })
export const newWalletFailure = (error) =>
  ({ type: WALLET_NEW_FAILURE, payload: error })
