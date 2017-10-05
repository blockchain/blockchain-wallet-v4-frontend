import * as T from './actionTypes'

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
