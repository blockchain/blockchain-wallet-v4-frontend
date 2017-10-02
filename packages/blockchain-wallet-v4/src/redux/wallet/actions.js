import * as T from './actionTypes'

// wallet signup
export const createWallet = (password, email) =>
  ({ type: T.CREATE_WALLET, payload: { password, email } })
export const createWalletSuccess = (guid, password, sharedKey, mnemonic, label, email, nAccounts) =>
  ({ type: T.CREATE_WALLET_SUCCESS, payload: { guid, password, sharedKey, mnemonic, label, email, nAccounts } })
export const createWalletError = (errorKey) =>
  ({ type: T.CREATE_WALLET_ERROR, payload: errorKey, error: true })

// wallet from Mnemonic
export const restoreWallet = (mnemonic, password, email, network) =>
  ({ type: T.RESTORE_WALLET, payload: { password, email, network } })
export const restoreWalletSuccess = (guid, password, sharedKey, mnemonic, label, email, nAccounts) =>
  ({ type: T.RESTORE_WALLET_SUCCESS, payload: { guid, password, sharedKey, mnemonic, label, email, nAccounts } })
export const restoreWalletError = (errorKey) =>
  ({ type: T.RESTORE_WALLET_ERROR, payload: errorKey, error: true })

// wallet remind guid
export const remindWalletGuid = (email, code, sessionToken) =>
  ({ type: T.REMIND_WALLET_GUID, payload: { email, code, sessionToken } })
export const remindWalletGuidSuccess = (data) =>
  ({ type: T.REMIND_WALLET_GUID_SUCCESS, payload: { data } })
export const remindWalletGuidError = (message) =>
  ({ type: T.REMIND_WALLET_GUID_ERROR, payload: message })

// second Password
export const toggleSecondPassword = (password) =>
  ({ type: T.TOGGLE_SECOND_PASSWORD, payload: password })
export const toggleSecondPasswordSuccess = (wallet) =>
  ({ type: T.TOGGLE_SECOND_PASSWORD_SUCCESS, payload: wallet })
export const toggleSecondPasswordError = (errorKey) =>
  ({ type: T.TOGGLE_SECOND_PASSWORD_ERROR, payload: errorKey, error: true })

export const changeSecondPassword = (oldPassword, newPassword) =>
  ({ type: T.CHANGE_SECOND_PASSWORD, payload: {oldPassword, newPassword} })
export const changeSecondPasswordSuccess = (wallet) =>
  ({ type: T.CHANGE_SECOND_PASSWORD_SUCCESS, payload: wallet })
export const changeSecondPasswordError = (errorKey) =>
  ({ type: T.CHANGE_SECOND_PASSWORD_ERROR, payload: errorKey, error: true })

// pbkdf2 iterations
export const setPbkdf2Iterations = (iterations, password) =>
  ({ type: T.SET_PBKDF2_ITERATIONS, payload: {iterations, password} })
export const setPbkdf2IterationsSuccess = (wrapper) =>
  ({ type: T.SET_PBKDF2_ITERATIONS_SUCCESS, payload: wrapper })
export const setPbkdf2IterationsError = (errorKey) =>
  ({ type: T.SET_PBKDF2_ITERATIONS_ERROR, payload: errorKey, error: true })

// legacy address Addition
export const createAddress = (address, secondPassword) =>
  ({ type: T.CREATE_LEGACY_ADDRESS, payload: {address, secondPassword} })
export const createAddressSuccess = (wrapper) =>
  ({ type: T.CREATE_LEGACY_ADDRESS_SUCCESS, payload: wrapper })
export const createAddressError = (errorKey) =>
  ({ type: T.CREATE_LEGACY_ADDRESS_ERROR, payload: errorKey, error: true })

// create trezor
export const createTrezorWallet = (accountIndex) =>
  ({ type: T.CREATE_TREZOR_WALLET, payload: accountIndex })
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

// autologout time
export const setAutoLogout = (time) => ({ type: T.SET_AUTOLOGOUT, payload: { time } })

// mnemonic verified
export const verifyMnemonic = () => ({ type: T.VERIFY_MNEMONIC })
