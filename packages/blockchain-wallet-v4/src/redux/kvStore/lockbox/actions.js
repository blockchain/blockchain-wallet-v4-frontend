import * as AT from './actionTypes'

// CREATE
export const createMetadataLockbox = data => ({
  type: AT.CREATE_METADATA_LOCKBOX,
  payload: data
})
export const createNewDeviceEntry = (
  deviceID,
  deviceType,
  deviceName,
  accounts
) => ({
  type: AT.CREATE_NEW_DEVICE_ENTRY,
  payload: { deviceID, deviceType, deviceName, accounts }
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
export const updateDeviceBalanceDisplay = (deviceID, showBalances) => ({
  type: AT.UPDATE_DEVICE_BALANCE_DISPLAY,
  payload: { deviceID, showBalances }
})
export const updateDeviceName = (deviceID, deviceName) => ({
  type: AT.UPDATE_DEVICE_NAME,
  payload: { deviceID, deviceName }
})

// DELETE
export const deleteDeviceLockbox = deviceID => ({
  type: AT.DELETE_DEVICE_LOCKBOX,
  payload: { deviceID }
})
