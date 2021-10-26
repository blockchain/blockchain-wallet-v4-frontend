import * as AT from './actionTypes'

// CREATE
export const createMetadataLockbox = (data) => ({
  payload: data,
  type: AT.CREATE_METADATA_LOCKBOX
})
export const createNewDeviceEntry = (deviceEntry) => ({
  payload: { deviceEntry },
  type: AT.CREATE_NEW_DEVICE_ENTRY
})

// FETCH
export const fetchMetadataLockbox = () => ({
  type: AT.FETCH_METADATA_LOCKBOX
})
export const fetchMetadataLockboxLoading = () => ({
  type: AT.FETCH_METADATA_LOCKBOX_LOADING
})
export const fetchMetadataLockboxSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_METADATA_LOCKBOX_SUCCESS
})
export const fetchMetadataLockboxFailure = (error) => ({
  payload: error,
  type: AT.FETCH_METADATA_LOCKBOX_FAILURE
})

// UPDATE
export const updateDeviceName = (deviceIndex, deviceName) => ({
  payload: { deviceIndex, deviceName },
  type: AT.UPDATE_DEVICE_NAME
})
export const addCoinEntry = (deviceIndex, coin, account) => ({
  payload: { account, coin, deviceIndex },
  type: AT.ADD_COIN_ENTRY
})
export const setLatestTxEthLockbox = (deviceIndex, txHash) => ({
  payload: { deviceIndex, txHash },
  type: AT.SET_LATEST_TX_ETH_LOCKBOX
})
export const setLatestTxTimestampEthLockbox = (deviceIndex, timestamp) => ({
  payload: { deviceIndex, timestamp },
  type: AT.SET_LATEST_TX_TIMESTAMP_ETH_LOCKBOX
})

// DELETE
export const deleteDeviceLockbox = (deviceIndex) => ({
  payload: { deviceIndex },
  type: AT.DELETE_DEVICE_LOCKBOX
})
