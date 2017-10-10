import * as T from './actionTypes'

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
