import * as T from './actionTypes'

export const addAddress = (address, secondPassword) =>
  ({ type: T.ADDRESS_ADD, payload: {address, secondPassword} })
export const addLabel = (address, label) =>
  ({ type: T.ADDRESS_LABEL, payload: {address, label} })
export const replaceWallet = (payload) =>
  ({ type: T.WALLET_REPLACE, payload: payload })
export const clearWallet = () =>
  ({ type: T.WALLET_CLEAR })
export const secondPasswordToggleRequest = (password) =>
  ({ type: T.REQUEST_SECOND_PASSWORD_TOGGLE, payload: password })
export const secondPasswordOn = (newWallet) =>
  ({ type: T.SECOND_PASSWORD_ON, payload: newWallet })
export const secondPasswordOff = (newWallet) =>
  ({ type: T.SECOND_PASSWORD_OFF, payload: newWallet })
export const changeMainPassword = (password) =>
  ({ type: T.MAIN_PASSWORD_CHANGE, payload: password })
export const setPayloadChecksum = (checksum) =>
  ({ type: T.SET_PAYLOAD_CHECKSUM, payload: checksum })
export const newWallet = (password, email) =>
  ({ type: T.WALLET_NEW, payload: { password, email } })
export const setNewWallet = (guid, password, sharedKey, mnemonic, label) =>
  ({ type: T.WALLET_NEW_SET, payload: { guid, password, sharedKey, mnemonic, label } })
export const newWalletSuccess = (email) =>
  ({ type: T.WALLET_NEW_SUCCESS, payload: email})
export const newWalletFailure = (error) =>
  ({ type: T.WALLET_NEW_FAILURE, payload: error })
export const setHdAddressLabel = (accountIdx, addressIdx, label) =>
  ({ type: T.HD_ADDRESS_LABEL_SET, payload: { accountIdx, addressIdx, label } })
export const removeHdAddressLabel = (accountIdx, addressIdx) =>
  ({ type: T.HD_ADDRESS_LABEL_REMOVE, payload: { accountIdx, addressIdx } })

export const onOpenAction = () => ({ type: T.SOCKET_OPEN })
export const onMessageAction = (data) => ({ type: T.SOCKET_MESSAGE, data })
export const onCloseAction = () => ({ type: T.SOCKET_CLOSE })

export const syncStart = () =>
  ({ type: T.SYNC_START })
export const syncSuccess = (checksum) =>
  ({ type: T.SYNC_SUCCESS, payload: checksum })
export const syncError = (error) =>
  ({ type: T.SYNC_ERROR, payload: error, error: true })
