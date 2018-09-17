import * as AT from './actionTypes'

// ROUTING
export const determineLockboxRoute = () => ({
  type: AT.DETERMINE_LOCKBOX_ROUTE
})

// CONNECTIONS
export const pollForDeviceApp = (
  appRequested,
  deviceIndex,
  deviceType,
  timeout
) => ({
  type: AT.POLL_FOR_DEVICE_APP,
  payload: { appRequested, deviceIndex, deviceType, timeout }
})
export const resetConnectionStatus = () => ({
  type: AT.RESET_CONNECTION_STATUS
})
export const setConnectionInfo = (app, deviceIndex, transport) => ({
  type: AT.SET_CONNECTION_INFO,
  payload: { app, deviceIndex, transport }
})
export const setConnectionError = error => ({
  type: AT.SET_CONNECTION_ERROR,
  payload: { error }
})
export const setConnectionReady = () => ({
  type: AT.SET_CONNECTION_READY
})

// NEW DEVICE SETUP
export const initializeNewDeviceSetup = () => ({
  type: AT.INITIALIZE_NEW_DEVICE_SETUP
})

// CREATE
export const changeDeviceSetupStep = (step, done, error) => ({
  type: AT.SET_NEW_DEVICE_SETUP_STEP,
  payload: { step, done, error }
})
export const checkDeviceAuthenticity = () => ({
  type: AT.CHECK_DEVICE_AUTHENTICITY
})
export const checkDeviceAuthenticityLoading = () => ({
  type: AT.CHECK_DEVICE_AUTHENTICITY_LOADING
})
export const checkDeviceAuthenticityFailure = failure => ({
  type: AT.CHECK_DEVICE_AUTHENTICITY_FAILURE,
  payload: { failure }
})
export const checkDeviceAuthenticitySuccess = isAuthentic => ({
  type: AT.CHECK_DEVICE_AUTHENTICITY_SUCCESS,
  payload: { isAuthentic }
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
export const updateDeviceName = (deviceIndex, deviceName) => ({
  type: AT.UPDATE_DEVICE_NAME,
  payload: { deviceIndex, deviceName }
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

// FIRMWARE
export const changeFirmwareUpdateStep = step => ({
  type: AT.SET_FIRMWARE_UPDATE_STEP,
  payload: { step }
})
export const setFirmwareInstalledInfo = info => ({
  type: AT.SET_FIRMWARE_INSTALLED_INFO,
  payload: { info }
})
export const setFirmwareLatestInfo = info => ({
  type: AT.SET_FIRMWARE_LATEST_INFO,
  payload: { info }
})
export const resetFirmwareInfo = () => ({
  type: AT.RESET_FIRMWARE_INFO
})
export const updateDeviceFirmware = deviceIndex => ({
  type: AT.UPDATE_DEVICE_FIRMWARE,
  payload: { deviceIndex }
})

// DELETE
export const deleteDevice = deviceIndex => ({
  type: AT.DELETE_DEVICE,
  payload: { deviceIndex }
})
export const deleteDeviceLoading = () => ({ type: AT.DELETE_DEVICE_LOADING })
export const deleteDeviceSuccess = () => ({ type: AT.DELETE_DEVICE_SUCCESS })
export const deleteDeviceFailure = payload => ({
  type: AT.DELETE_DEVICE_FAILURE,
  payload
})

// DASHBOARD
export const initializeDashboard = () => ({ type: AT.INITIALIZE_DASHBOARD })
export const updateTransactionList = () => ({
  type: AT.UPDATE_TRANSACTION_LIST
})

// APPLICATIONS
export const installApplication = (deviceIndex, app) => ({
  type: AT.INSTALL_APPLICATION,
  payload: { deviceIndex, app }
})
export const installApplicationLoading = app => ({
  type: AT.INSTALL_APPLICATION_LOADING,
  payload: { app }
})
export const installApplicationSuccess = app => ({
  type: AT.INSTALL_APPLICATION_SUCCESS,
  payload: { app }
})
export const installApplicationFailure = (app, error) => ({
  type: AT.INSTALL_APPLICATION_FAILURE,
  payload: { app, error }
})
export const installBlockchainApps = deviceIndex => ({
  type: AT.INSTALL_BLOCKCHAIN_APPS,
  payload: { deviceIndex }
})
export const installBlockchainAppsLoading = () => ({
  type: AT.INSTALL_BLOCKCHAIN_APPS_LOADING
})
export const installBlockchainAppsSuccess = () => ({
  type: AT.INSTALL_BLOCKCHAIN_APPS_SUCCESS
})
export const installBlockchainAppsFailure = error => ({
  type: AT.INSTALL_BLOCKCHAIN_APPS_FAILURE,
  payload: { error }
})
