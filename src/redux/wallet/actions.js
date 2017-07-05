import * as T from './actionTypes'

// wallet signup
export const createWallet = (password, email) =>
  ({ type: T.CREATE_WALLET, payload: { password, email } })
export const createWalletSuccess = (guid, password, sharedKey, mnemonic, label, email) =>
  ({ type: T.CREATE_WALLET_SUCCESS, payload: { guid, password, sharedKey, mnemonic, label, email } })
export const createWalletError = (errorKey) =>
  ({ type: T.CREATE_WALLET_ERROR, payload: errorKey, error: true })

// second Password
export const toggleSecondPassword = (password) =>
  ({ type: T.TOGGLE_SECOND_PASSWORD, payload: password })
export const toggleSecondPasswordSuccess = (wallet) =>
  ({ type: T.TOGGLE_SECOND_PASSWORD_SUCCESS, payload: { wallet } })
export const toggleSecondPasswordError = (errorKey) =>
  ({ type: T.TOGGLE_SECOND_PASSWORD_ERROR, payload: errorKey, error: true })

// legacy address Addition
export const createAddress = (address, secondPassword) =>
  ({ type: T.CREATE_LEGACY_ADDRESS, payload: {address, secondPassword} })
export const createAddressSuccess = (wallet) =>
  ({ type: T.CREATE_LEGACY_ADDRESS_SUCCESS, payload: { wallet } })
export const createAddressError = (errorKey) =>
  ({ type: T.CREATE_LEGACY_ADDRESS_ERROR, payload: errorKey, error: true })

// socket middleware
export const openSocket = () =>
  ({ type: T.OPEN_SOCKET })
export const messageSocket = (data) =>
  ({ type: T.MESSAGE_SOCKET, data })
export const closeSocket = () =>
  ({ type: T.CLOSE_SOCKET })

// walletSync middleware
export const sync = () =>
  ({ type: T.SYNC })
export const syncSuccess = (checksum) =>
  ({ type: T.SYNC_SUCCESS, payload: checksum })
export const syncError = (error) =>
  ({ type: T.SYNC_ERROR, payload: error, error: true })

// create trezor
export const createTrezorWallet = (accountIndex) =>
  ({ type: T.CREATE_TREZOR_WALLET, payload: accountIndex})
export const createTrezorWalletSuccess = (wrapper) =>
  ({ type: T.CREATE_TREZOR_WALLET_SUCCESS, payload: wrapper })
export const createTrezorWalletError = (errorKey) =>
  ({ type: T.CREATE_TREZOR_WALLET_ERROR, payload: errorKey, error: true })

// setters
export const setWrapper = (payload) =>
  ({ type: T.SET_WRAPPER, payload: payload })
export const setMainPassword = (password) =>
  ({ type: T.SET_MAIN_PASSWORD, payload: password })
export const setPayloadChecksum = (checksum) =>
  ({ type: T.SET_PAYLOAD_CHECKSUM, payload: checksum })
export const setLegacyAddressLabel = (address, label) =>
  ({ type: T.SET_LEGACY_ADDRESS_LABEL, payload: {address, label} })
export const setHdAddressLabel = (accountIdx, addressIdx, label) =>
  ({ type: T.SET_HD_ADDRESS_LABEL, payload: { accountIdx, addressIdx, label } })

// deletes
export const deleteWrapper = () =>
  ({ type: T.DELETE_WRAPPER })
export const deleteLegacyAddress = (address) =>
  ({ type: T.DELETE_LEGACY_ADDRESS, payload: address })
export const deleteHdAddressLabel = (accountIdx, addressIdx) =>
  ({ type: T.DELETE_HD_ADDRESS_LABEL, payload: { accountIdx, addressIdx } })
