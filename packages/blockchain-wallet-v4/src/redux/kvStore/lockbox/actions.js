import * as AT from './actionTypes'

// CREATE
export const createMetadataLockbox = data => ({
  type: AT.CREATE_METADATA_LOCKBOX,
  payload: data
})

// FETCH
export const fetchMetadataLockbox = () => ({
  type: AT.FETCH_METADATA_LOCKBOX
})
export const fetchMetadataLockboxLoading = () => ({
  type: AT.FETCH_METADATA_LOCKBOX_LOADING
})
export const fetchMetadataLockboxSuccess = data => ({
  type: AT.FETCH_METADATA_LOCKBOX_SUCCESS,
  payload: data
})
export const fetchMetadataLockboxFailure = error => ({
  type: AT.FETCH_METADATA_LOCKBOX_FAILURE,
  payload: error
})

// UPDATE
export const storeDeviceName = (deviceID, deviceName) => ({
  type: AT.STORE_DEVICE_NAME,
  payload: { deviceID, deviceName }
})

export const storeDeviceBackupFlag = (deviceID) => ({
  type: AT.STORE_DEVICE_BACKUP_FLAG,
  payload: { deviceID }
})

export const storeDeviceAccounts = (deviceID, mdAccountsEntry) => ({
  type: AT.STORE_DEVICE_ACCOUNTS,
  payload: { deviceID, mdAccountsEntry }
})

// DELETE
export const deleteDeviceLockbox = deviceID => ({
  type: AT.DELETE_DEVICE_LOCKBOX,
  payload: { deviceID }
})
