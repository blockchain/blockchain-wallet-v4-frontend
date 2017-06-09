export const ADDRESS_ADD = '@v3.ADDRESS_ADD'
export const ADDRESS_LABEL = '@v3.ADDRESS_LABEL'
export const WALLET_REPLACE = '@v3.WALLET_REPLACE'
export const WALLET_CLEAR = '@v3.WALLET_CLEAR'
export const SECOND_PASSWORD_ON = '@v3.SECOND_PASSWORD_ON'
export const SECOND_PASSWORD_OFF = '@v3.SECOND_PASSWORD_OFF'
export const MAIN_PASSWORD_CHANGE = '@v3.MAIN_PASSWORD_CHANGE'
export const PAYLOAD_CHECKSUM_CHANGE = '@v3.PAYLOAD_CHECKSUM_CHANGE'
export const WALLET_NEW = '@v3.WALLET_NEW'
export const WALLET_NEW_FAILURE = '@v3.WALLET_NEW_FAILURE'
export const WALLET_NEW_SUCCESS = '@v3.WALLET_NEW_SUCCESS'
export const WALLET_NEW_SET = '@v3.WALLET_NEW_SET'
export const REQUEST_SECOND_PASSWORD_TOGGLE = '@v3.REQUEST_SECOND_PASSWORD_TOGGLE'

export const addAddress = (address, secondPassword) =>
  ({ type: ADDRESS_ADD, payload: {address, secondPassword} })
export const addLabel = (address, label) =>
  ({ type: ADDRESS_LABEL, payload: {address, label} })
export const replaceWallet = (payload) =>
  ({ type: WALLET_REPLACE, payload: payload })
export const clearWallet = () =>
  ({ type: WALLET_CLEAR })
export const secondPasswordToggleRequest = (password) =>
  ({ type: REQUEST_SECOND_PASSWORD_TOGGLE, payload: password })
export const secondPasswordOn = (newWallet) =>
  ({ type: SECOND_PASSWORD_ON, payload: newWallet })
export const secondPasswordOff = (newWallet) =>
  ({ type: SECOND_PASSWORD_OFF, payload: newWallet })
export const changeMainPassword = (password) =>
  ({ type: MAIN_PASSWORD_CHANGE, payload: password })
export const changePayloadChecksum = (checksum) =>
  ({ type: PAYLOAD_CHECKSUM_CHANGE, payload: checksum })
export const newWallet = (password, email) =>
  ({ type: WALLET_NEW, payload: { password, email } })
export const setNewWallet = (guid, sharedKey, mnemonic) =>
  ({ type: WALLET_NEW_SET, payload: { guid, sharedKey, mnemonic } })
export const newWalletSuccess = () =>
  ({ type: WALLET_NEW_SUCCESS })
export const newWalletFailure = (error) =>
  ({ type: WALLET_NEW_FAILURE, payload: error })

// socket middleware
export const SOCKET_OPEN = '@v3.SOCKET_OPEN'
export const SOCKET_MESSAGE = '@v3.SOCKET_MESSAGE'
export const SOCKET_CLOSE = '@v3.SOCKET_CLOSE'

export const onOpenAction = () => ({ type: SOCKET_OPEN })
export const onMessageAction = (data) => ({ type: SOCKET_MESSAGE, data })
export const onCloseAction = () => ({ type: SOCKET_CLOSE })

// walletSync middleware
export const SYNC_START = '@v3.SYNC_START'
export const SYNC_SUCCESS = '@v3.SYNC_SUCCESS'
export const SYNC_ERROR = '@v3.SYNC_ERROR'

export const syncStart = () =>
  ({ type: SYNC_START })
export const syncSuccess = (checksum) =>
  ({ type: SYNC_SUCCESS, payload: checksum })
export const syncError = (error) =>
  ({ type: SYNC_ERROR, payload: error, error: true })
