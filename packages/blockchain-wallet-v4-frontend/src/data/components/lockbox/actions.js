import * as AT from './actionTypes'

// CONNECTIONS
export const initializeConnect = () => ({ type: AT.INITIALIZE_CONNECT })
export const changeDeviceSetupStep = step => ({
  type: AT.SET_CONNECT_STEP,
  payload: { step }
})

// CREATE
export const storeNewDevice = deviceName => ({
  type: AT.STORE_NEW_DEVICE,
  payload: { deviceName }
})
export const storeNewDeviceLoading = () => ({
  type: AT.STORE_NEW_DEVICE_LOADING
})
export const storeNewDeviceSuccess = () => ({
  type: AT.STORE_NEW_DEVICE_SUCCESS
})
export const storeNewDeviceFailure = payload => ({
  type: AT.STORE_NEW_DEVICE_FAILURE,
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
