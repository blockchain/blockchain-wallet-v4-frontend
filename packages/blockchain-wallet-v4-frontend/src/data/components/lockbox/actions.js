import * as AT from './actionTypes'

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
export const setConnectionInfo = (app, deviceIndex, deviceType, transport) => ({
  type: AT.SET_CONNECTION_INFO,
  payload: { app, deviceIndex, deviceType, transport }
})
export const setConnectionError = error => ({
  type: AT.SET_CONNECTION_ERROR,
  payload: { error }
})
export const setConnectionReady = () => ({
  type: AT.SET_CONNECTION_READY
})
export const setConnectionSuccess = () => ({
  type: AT.SET_CONNECTION_SUCCESS
})
export const setDeviceTargetId = targetId => ({
  type: AT.SET_DEVICE_TARGET_ID,
  payload: targetId
})

// NEW DEVICE SETUP
export const initializeNewDeviceSetup = () => ({
  type: AT.INITIALIZE_NEW_DEVICE_SETUP
})
export const resetNewDeviceSetup = () => ({
  type: AT.RESET_NEW_DEVICE_SETUP
})
export const finalizeNewDeviceSetup = () => ({
  type: AT.FINALIZE_NEW_DEVICE_SETUP
})
export const routeNewDeviceToDashboard = startTour => ({
  type: AT.ROUTE_NEW_DEVICE_DASHBOARD,
  payload: { startTour }
})
export const changeDeviceSetupStep = (step, done, error) => ({
  type: AT.SET_NEW_DEVICE_SETUP_STEP,
  payload: { step, done, error }
})
export const setSetupNewOrExisting = type => ({
  type: AT.SET_SETUP_NEW_OR_EXISTING,
  payload: type
})
export const setDeviceSetupType = type => ({
  type: AT.SET_SETUP_DEVICE_TYPE,
  payload: type
})
export const setNewDeviceShowBtcWarning = showWarning => ({
  type: AT.SET_NEW_DEVICE_SHOW_BTC_WARNING,
  payload: showWarning
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
export const changeFirmwareUpdateStep = (step, status) => ({
  type: AT.SET_FIRMWARE_UPDATE_STEP,
  payload: { step, status }
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
export const initializeDashboard = deviceIndex => ({
  type: AT.INITIALIZE_DASHBOARD,
  payload: { deviceIndex, reset: true }
})
export const updateTransactionList = deviceIndex => ({
  type: AT.UPDATE_TRANSACTION_LIST,
  payload: { deviceIndex }
})

// APPLICATIONS
export const initializeAppManager = deviceIndex => ({
  type: AT.INITIALIZE_APP_MANAGER,
  payload: { deviceIndex }
})
export const setLatestAppInfosLoading = () => ({
  type: AT.SET_LATEST_APP_INFOS_LOADING
})
export const setLatestAppInfosFailure = () => ({
  type: AT.SET_LATEST_APP_INFOS_FAILURE
})
export const setLatestAppInfosSuccess = appInfos => ({
  type: AT.SET_LATEST_APP_INFOS_SUCCESS,
  payload: appInfos
})
export const installApplication = appName => ({
  type: AT.INSTALL_APPLICATION,
  payload: { appName }
})
export const uninstallApplication = appName => ({
  type: AT.UNINSTALL_APPLICATION,
  payload: { appName }
})
export const appChangeLoading = () => ({
  type: AT.APP_CHANGE_LOADING
})
export const appChangeSuccess = (appName, changeType) => ({
  type: AT.APP_CHANGE_SUCCESS,
  payload: { appName, changeType }
})
export const appChangeFailure = (appName, changeType, error) => ({
  type: AT.APP_CHANGE_FAILURE,
  payload: { appName, changeType, error }
})
export const resetAppChangeStatus = () => ({
  type: AT.RESET_APP_CHANGE_STATUS
})

// MISC
export const determineLockboxRoute = () => ({
  type: AT.DETERMINE_LOCKBOX_ROUTE
})
export const saveCoinMD = (deviceIndex, coin) => ({
  type: AT.SAVE_COIN_MD,
  payload: { deviceIndex, coin }
})
export const lockboxModalClose = () => ({
  type: AT.LOCKBOX_MODAL_CLOSE
})
export const setProductTourVisibility = visibility => ({
  type: AT.SET_PRODUCT_TOUR_VISIBILITY,
  payload: visibility
})
