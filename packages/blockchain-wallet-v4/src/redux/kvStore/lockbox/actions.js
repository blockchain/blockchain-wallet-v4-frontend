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
export const addCoinEntry = (deviceIndex, coin, account) => ({
  type: AT.ADD_COIN_ENTRY,
  payload: { deviceIndex, coin, account }
})
export const setLatestTxEthLockbox = (deviceIndex, txHash) => ({
  type: AT.SET_LATEST_TX_ETH_LOCKBOX,
  payload: { deviceIndex, txHash }
})
export const setLatestTxTimestampEthLockbox = (deviceIndex, timestamp) => ({
  type: AT.SET_LATEST_TX_TIMESTAMP_ETH_LOCKBOX,
  payload: { deviceIndex, timestamp }
})

// DELETE
export const deleteDeviceLockbox = deviceIndex => ({
  type: AT.DELETE_DEVICE_LOCKBOX,
  payload: { deviceIndex }
})
