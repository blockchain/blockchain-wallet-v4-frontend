import * as AT from './actionTypes'

// CONNECTIONS
export const initializeConnect = () => ({ type: AT.INITIALIZE_CONNECT })
export const setConnectStep = step => ({
  type: AT.SET_CONNECT_STEP,
  payload: { step }
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
export const storeDeviceName = deviceName => ({
  type: AT.STORE_DEVICE_NAME,
  payload: { deviceName }
})
export const storeDeviceNameLoading = () => ({
  type: AT.STORE_DEVICE_NAME_LOADING
})
export const storeDeviceNameSuccess = () => ({
  type: AT.STORE_DEVICE_NAME_SUCCESS
})
export const storeDeviceNameFailure = payload => ({
  type: AT.STORE_DEVICE_NAME_FAILURE,
  payload
})

export const storeDeviceBackupFlag = backupConfirmed => ({
  type: AT.STORE_DEVICE_BACKUP_FLAG,
  payload: { backupConfirmed }
})
export const storeDeviceBackupFlagLoading = () => ({
  type: AT.STORE_DEVICE_BACKUP_FLAG_LOADING
})
export const storeDeviceBackupFlagSuccess = () => ({
  type: AT.STORE_DEVICE_BACKUP_FLAG_SUCCESS
})
export const storeDeviceBackupFlagFailure = payload => ({
  type: AT.STORE_DEVICE_BACKUP_FLAG_FAILURE,
  payload
})

export const storeDeviceAccounts = payload => ({
  type: AT.STORE_DEVICE_ACCOUNTS,
  payload
})
export const storeDeviceAccountsLoading = () => ({
  type: AT.STORE_DEVICE_ACCOUNTS_LOADING
})
export const storeDeviceAccountsSuccess = () => ({
  type: AT.STORE_DEVICE_ACCOUNTS_SUCCESS
})
export const storeDeviceAccountsFailure = payload => ({
  type: AT.STORE_DEVICE_ACCOUNTS_FAILURE,
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
