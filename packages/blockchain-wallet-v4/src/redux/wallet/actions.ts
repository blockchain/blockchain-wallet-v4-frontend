import * as T from './actionTypes'

// setters
export const setWrapper = payload => ({
  type: T.SET_WRAPPER,
  payload: payload
})
// ignored by the sync middleware and used by websocket middleware
export const refreshWrapper = payload => ({
  type: T.REFRESH_WRAPPER,
  payload: payload
})
export const setMainPassword = password => ({
  type: T.SET_MAIN_PASSWORD,
  payload: password
})
export const setPayloadChecksum = checksum => ({
  type: T.SET_PAYLOAD_CHECKSUM,
  payload: checksum
})
export const setLegacyAddressLabel = (address, label) => ({
  type: T.SET_LEGACY_ADDRESS_LABEL,
  payload: { address, label }
})
export const setAddressArchived = (address, archived) => ({
  type: T.SET_ADDRESS_ARCHIVED,
  payload: { address, archived }
})
export const setHdAddressLabel = (accountIdx, addressIdx, label) => ({
  type: T.SET_HD_ADDRESS_LABEL,
  payload: { accountIdx, addressIdx, label }
})
export const createLegacyAddress = address => ({
  type: T.CREATE_LEGACY_ADDRESS,
  payload: address
})
export const setAccountLabel = (accountIdx, label) => ({
  type: T.SET_ACCOUNT_LABEL,
  payload: { accountIdx, label }
})
export const setAccountArchived = (accountIdx, archived) => ({
  type: T.SET_ACCOUNT_ARCHIVED,
  payload: { accountIdx, archived }
})
export const setDefaultAccountIdx = index => ({
  type: T.SET_DEFAULT_ACCOUNT,
  payload: { index }
})
export const setTransactionNote = (txHash, txNote) => ({
  type: T.SET_TRANSACTION_NOTE,
  payload: { txHash, txNote }
})
export const setSyncPubKeys = syncPubKeys => ({
  type: T.SET_SYNC_PUB_KEYS,
  payload: { syncPubKeys }
})

// deletes
export const deleteWrapper = () => ({ type: T.DELETE_WRAPPER })
export const deleteLegacyAddress = address => ({
  type: T.DELETE_LEGACY_ADDRESS,
  payload: address
})
export const deleteHdAddressLabel = (accountIdx, addressIdx) => ({
  type: T.DELETE_HD_ADDRESS_LABEL,
  payload: { accountIdx, addressIdx }
})

// autologout time
export const setAutoLogout = time => ({
  type: T.SET_AUTOLOGOUT,
  payload: { time }
})

// mnemonic verified
export const verifyMnemonic = () => ({ type: T.VERIFY_MNEMONIC })

// check/update account labels
export const checkAndUpdateAccountLabels = () => ({
  type: T.CHECK_UPDATE_ACCT_LABELS
})
