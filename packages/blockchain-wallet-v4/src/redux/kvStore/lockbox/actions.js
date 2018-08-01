import * as AT from './actionTypes'

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
export const createMetadataLockbox = data => ({
  type: AT.CREATE_METADATA_LOCKBOX,
  payload: data
})
export const addDeviceLockbox = (deviceID, deviceName) => ({
  type: AT.ADD_DEVICE_LOCKBOX,
  payload: { deviceID, deviceName }
})
export const saveDeviceLockbox = (deviceID, accounts) => ({
  type: AT.SAVE_DEVICE_LOCKBOX,
  payload: { deviceID, accounts }
})
