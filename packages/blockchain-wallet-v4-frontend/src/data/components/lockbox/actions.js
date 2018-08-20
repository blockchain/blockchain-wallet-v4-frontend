import * as AT from './actionTypes'

// CONNECTIONS
export const initializeNewDeviceSetup = () => ({
  type: AT.INITIALIZE_NEW_DEVICE_SETUP
})
export const pollForConnectionStatus = requestedApp => ({
  type: AT.POLL_FOR_CONNECTION_STATUS,
  payload: { requestedApp }
})
export const pollForConnectionStatusLoading = () => ({
  type: AT.POLL_FOR_CONNECTION_STATUS_LOADING
})
export const pollForConnectionStatusSuccess = payload => ({
  type: AT.POLL_FOR_CONNECTION_STATUS_SUCCESS,
  payload
})
export const pollForConnectionStatusFailure = payload => ({
  type: AT.POLL_FOR_CONNECTION_STATUS_FAILURE,
  payload
})
export const storeTransportObject = transport => ({
  type: AT.STORE_TRANSPORT_OBJECT,
  payload: { transport }
})

// CREATE
export const changeDeviceSetupStep = step => ({
  type: AT.SET_CONNECT_STEP,
  payload: { step }
})
export const setNewDeviceInfo = deviceInfo => ({
  type: AT.SET_NEW_DEVICE_INFO,
  payload: { deviceInfo }
})
export const saveNewDeviceKvStore = deviceName => ({
  type: AT.SAVE_NEW_DEVICE_KVSTORE,
  payload: { deviceName }
})
export const saveNewDeviceKvStoreLoading = () => ({
  type: AT.SAVE_NEW_DEVICE_KVSTORE_LOADING
})
export const saveNewDeviceKvStoreSuccess = () => ({
  type: AT.SAVE_NEW_DEVICE_KVSTORE_SUCCESS
})
export const saveNewDeviceKvStoreFailure = payload => ({
  type: AT.SAVE_NEW_DEVICE_KVSTORE_FAILURE,
  payload
})

// UPDATE
export const updateDeviceName = (deviceID, deviceName) => ({
  type: AT.UPDATE_DEVICE_NAME,
  payload: { deviceID, deviceName }
})
export const updateDeviceNameLoading = () => ({
  type: AT.UPDATE_DEVICE_NAME_LOADING
})
export const updateDeviceNameSuccess = () => ({
  type: AT.UPDATE_DEVICE_NAME_SUCCESS
})
export const updateDeviceNameFailure = payload => ({
  type: AT.UPDATE_DEVICE_NAME_FAILURE,
  payload
})

export const updateDeviceBalanceDisplay = (deviceID, showBalances) => ({
  type: AT.UPDATE_DEVICE_BALANCE_DISPLAY,
  payload: { deviceID, showBalances }
})
export const updateDeviceBalanceDisplayLoading = () => ({
  type: AT.UPDATE_DEVICE_BALANCE_DISPLAY_LOADING
})
export const updateDeviceBalanceDisplaySuccess = () => ({
  type: AT.UPDATE_DEVICE_BALANCE_DISPLAY_SUCCESS
})
export const updateDeviceBalanceDisplayFailure = payload => ({
  type: AT.UPDATE_DEVICE_BALANCE_DISPLAY_FAILURE,
  payload
})

// DELETE
export const deleteDevice = deviceID => ({
  type: AT.DELETE_DEVICE,
  payload: { deviceID }
})
export const deleteDeviceLoading = () => ({ type: AT.DELETE_DEVICE_LOADING })
export const deleteDeviceSuccess = () => ({ type: AT.DELETE_DEVICE_SUCCESS })
export const deleteDeviceFailure = payload => ({
  type: AT.DELETE_DEVICE_FAILURE,
  payload
})
