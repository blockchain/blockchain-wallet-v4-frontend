import * as AT from './actionTypes'

export const setConnectStep = step => ({
  type: AT.SET_CONNECT_STEP,
  payload: { step }
})

export const initializeConnect = () => ({ type: AT.INITIALIZE_CONNECT })
export const deviceInfoLoading = () => ({ type: AT.DEVICE_INFO_LOADING })
export const deviceInfoSuccess = payload => ({
  type: AT.DEVICE_INFO_SUCCESS,
  payload
})
export const deviceInfoFailure = payload => ({
  type: AT.DEVICE_INFO_FAILURE,
  payload
})

export const addDevice = deviceName => ({
  type: AT.ADD_DEVICE,
  payload: { deviceName }
})
export const addDeviceLoading = () => ({ type: AT.ADD_DEVICE_LOADING })
export const addDeviceSuccess = () => ({ type: AT.ADD_DEVICE_SUCCESS })
export const addDeviceFailure = payload => ({
  type: AT.ADD_DEVICE_FAILURE,
  payload
})

export const saveDevice = payload => ({
  type: AT.SAVE_DEVICE,
  payload
})
export const saveDeviceLoading = () => ({ type: AT.SAVE_DEVICE_LOADING })
export const saveDeviceSuccess = () => ({ type: AT.SAVE_DEVICE_SUCCESS })
export const saveDeviceFailure = payload => ({
  type: AT.SAVE_DEVICE_FAILURE,
  payload
})

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
