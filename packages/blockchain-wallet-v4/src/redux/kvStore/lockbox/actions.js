import * as AT from './actionTypes'

// CREATE
export const createMetadataLockbox = data => ({
  type: AT.CREATE_METADATA_LOCKBOX,
  payload: data
})
export const createNewDeviceEntry = deviceEntry => ({
  type: AT.CREATE_NEW_DEVICE_ENTRY,
  payload: { deviceEntry }
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
export const updateDeviceName = (deviceIndex, deviceName) => ({
  type: AT.UPDATE_DEVICE_NAME,
  payload: { deviceIndex, deviceName }
})

// DELETE
export const deleteDeviceLockbox = deviceIndex => ({
  type: AT.DELETE_DEVICE_LOCKBOX,
  payload: { deviceIndex }
})
