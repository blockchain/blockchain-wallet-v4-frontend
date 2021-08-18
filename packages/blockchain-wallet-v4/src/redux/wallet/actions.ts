import * as T from './actionTypes'

// setters
export const setWrapper = (payload) => ({
  payload,
  type: T.SET_WRAPPER
})
// ignored by the sync middleware and used by websocket middleware
export const refreshWrapper = (payload) => ({
  payload,
  type: T.REFRESH_WRAPPER
})
export const setMainPassword = (password) => ({
  payload: password,
  type: T.SET_MAIN_PASSWORD
})
export const setPayloadChecksum = (checksum) => ({
  payload: checksum,
  type: T.SET_PAYLOAD_CHECKSUM
})
export const setLegacyAddressLabel = (address, label) => ({
  payload: { address, label },
  type: T.SET_LEGACY_ADDRESS_LABEL
})
export const setAddressArchived = (address, archived) => ({
  payload: { address, archived },
  type: T.SET_ADDRESS_ARCHIVED
})
export const setHdAddressLabel = (accountIdx, addressIdx, derivationType, label) => ({
  payload: { accountIdx, addressIdx, derivationType, label },

  type: T.SET_HD_ADDRESS_LABEL
})
export const createLegacyAddress = (address) => ({
  payload: address,
  type: T.CREATE_LEGACY_ADDRESS
})
export const setAccountLabel = (accountIdx, label) => ({
  payload: { accountIdx, label },
  type: T.SET_ACCOUNT_LABEL
})
export const setAccountArchived = (accountIdx, archived) => ({
  payload: { accountIdx, archived },
  type: T.SET_ACCOUNT_ARCHIVED
})
export const setDefaultAccountIdx = (index) => ({
  payload: { index },
  type: T.SET_DEFAULT_ACCOUNT
})
export const setTransactionNote = (txHash, txNote) => ({
  payload: { txHash, txNote },
  type: T.SET_TRANSACTION_NOTE
})
export const setSyncPubKeys = (syncPubKeys) => ({
  payload: { syncPubKeys },
  type: T.SET_SYNC_PUB_KEYS
})

// deletes
export const deleteWrapper = () => ({ type: T.DELETE_WRAPPER })
export const deleteLegacyAddress = (address) => ({
  payload: address,
  type: T.DELETE_LEGACY_ADDRESS
})
export const deleteHdAddressLabel = (accountIdx, addressIdx, derivationType) => ({
  payload: { accountIdx, addressIdx, derivationType },
  type: T.DELETE_HD_ADDRESS_LABEL
})

// autologout time
export const setAutoLogout = (time) => ({
  payload: { time },
  type: T.SET_AUTOLOGOUT
})

// mnemonic verified
export const verifyMnemonic = () => ({ type: T.VERIFY_MNEMONIC })

// check/update account labels
export const checkAndUpdateAccountLabels = () => ({
  type: T.CHECK_UPDATE_ACCT_LABELS
})

// mnemonic verified timestamp
export const updateMnemonicBackup = () => ({
  type: T.UPDATE_MNEMONIC_BACKUP
})

// trigger alert that mnemonic was viewed
export const triggerMnemonicViewedAlert = () => ({
  type: T.MNEMONIC_VIEWED_ALERT
})

export const triggerNonCustodialSendAlert = (currency: string, amount: any) => ({
  payload: { amount, currency },
  type: T.NON_CUSTODIAL_SEND_ALERT
})
