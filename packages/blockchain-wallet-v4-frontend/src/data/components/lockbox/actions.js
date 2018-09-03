import * as AT from './actionTypes'

export const determineLockboxRoute = () => ({
  type: AT.DETERMINE_LOCKBOX_ROUTE
})

// CONNECTIONS
export const pollForDeviceApp = (
  appRequested,
  deviceId,
  deviceType,
  timeout
) => ({
  type: AT.POLL_FOR_DEVICE_APP,
  payload: { appRequested, deviceId, deviceType, timeout }
})
export const resetConnectionStatus = () => ({
  type: AT.RESET_CONNECTION_STATUS
})
export const setCurrentApp = app => ({
  type: AT.SET_CURRENT_APP,
  payload: { app }
})
export const setConnectionError = error => ({
  type: AT.SET_CONNECTION_ERROR,
  payload: { error }
})
export const setCurrentDevice = deviceId => ({
  type: AT.SET_CURRENT_DEVICE,
  payload: { deviceId }
})
export const setCurrentTransport = transport => ({
  type: AT.SET_CURRENT_TRANSPORT,
  payload: { transport }
})

// NEW DEVICE SETUP
export const initializeNewDeviceSetup = () => ({
  type: AT.INITIALIZE_NEW_DEVICE_SETUP
})
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
export const updateDeviceFirmware = deviceID => ({
  type: AT.UPDATE_DEVICE_FIRMWARE,
  payload: { deviceID }
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
