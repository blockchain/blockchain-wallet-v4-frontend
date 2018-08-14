import * as AT from './actionTypes'

// CONNECTIONS
export const initializeDeviceConnection = () => ({
  type: AT.INITIALIZE_DEVICE_CONNECTION
})
export const pollForConnectionStatus = () => ({
  type: AT.POLL_FOR_CONNECTION_STATUS
})

// CREATE
export const changeDeviceSetupStep = step => ({
  type: AT.SET_CONNECT_STEP,
  payload: { step }
})
export const setNewDeviceID = deviceID => ({
  type: AT.SET_NEW_DEVICE_ID,
  payload: { deviceID }
})
export const setNewDeviceName = deviceName => ({
  type: AT.SET_NEW_DEVICE_NAME,
  payload: { deviceName }
})
export const saveNewDeviceKvStore = () => ({
  type: AT.SAVE_NEW_DEVICE_KVSTORE
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

// FETCH
export const deviceInfoLoading = () => ({ type: AT.DEVICE_INFO_LOADING })
export const deviceInfoSuccess = payload => ({
  type: AT.DEVICE_INFO_SUCCESS,
  payload
})
export const deviceInfoFailure = payload => ({
  type: AT.DEVICE_INFO_FAILURE,
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
