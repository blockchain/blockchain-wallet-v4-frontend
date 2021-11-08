import * as AT from './actionTypes'

// CONNECTIONS
export const pollForDeviceApp = (appRequested, deviceIndex, deviceType, timeout) => ({
  payload: { appRequested, deviceIndex, deviceType, timeout },
  type: AT.POLL_FOR_DEVICE_APP
})
export const resetConnectionStatus = () => ({
  type: AT.RESET_CONNECTION_STATUS
})
export const setConnectionInfo = (app, deviceIndex, deviceType, transport) => ({
  payload: { app, deviceIndex, deviceType, transport },
  type: AT.SET_CONNECTION_INFO
})
export const setConnectionError = (error) => ({
  payload: { error },
  type: AT.SET_CONNECTION_ERROR
})
export const setConnectionReady = () => ({
  type: AT.SET_CONNECTION_READY
})
export const setConnectionSuccess = () => ({
  type: AT.SET_CONNECTION_SUCCESS
})
export const setDeviceTargetId = (targetId) => ({
  payload: targetId,
  type: AT.SET_DEVICE_TARGET_ID
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
export const routeNewDeviceToDashboard = (startTour) => ({
  payload: { startTour },
  type: AT.ROUTE_NEW_DEVICE_DASHBOARD
})
export const changeDeviceSetupStep = (step, done, error) => ({
  payload: { done, error, step },
  type: AT.SET_NEW_DEVICE_SETUP_STEP
})
export const setSetupNewOrExisting = (type) => ({
  payload: type,
  type: AT.SET_SETUP_NEW_OR_EXISTING
})
export const setDeviceSetupType = (type) => ({
  payload: type,
  type: AT.SET_SETUP_DEVICE_TYPE
})
export const setNewDeviceShowBtcWarning = (showWarning) => ({
  payload: showWarning,
  type: AT.SET_NEW_DEVICE_SHOW_BTC_WARNING
})
export const setNewDeviceInfo = (deviceInfo) => ({
  payload: { deviceInfo },
  type: AT.SET_NEW_DEVICE_INFO
})
export const saveNewDeviceKvStore = (deviceName) => ({
  payload: { deviceName },
  type: AT.SAVE_NEW_DEVICE_KVSTORE
})
export const saveNewDeviceKvStoreLoading = () => ({
  type: AT.SAVE_NEW_DEVICE_KVSTORE_LOADING
})
export const saveNewDeviceKvStoreSuccess = () => ({
  type: AT.SAVE_NEW_DEVICE_KVSTORE_SUCCESS
})
export const saveNewDeviceKvStoreFailure = (payload) => ({
  payload,
  type: AT.SAVE_NEW_DEVICE_KVSTORE_FAILURE
})

// UPDATE
export const updateDeviceName = (deviceIndex, deviceName) => ({
  payload: { deviceIndex, deviceName },
  type: AT.UPDATE_DEVICE_NAME
})
export const updateDeviceNameLoading = () => ({
  type: AT.UPDATE_DEVICE_NAME_LOADING
})
export const updateDeviceNameSuccess = () => ({
  type: AT.UPDATE_DEVICE_NAME_SUCCESS
})
export const updateDeviceNameFailure = (payload) => ({
  payload,
  type: AT.UPDATE_DEVICE_NAME_FAILURE
})

// FIRMWARE
export const changeFirmwareUpdateStep = (step, status) => ({
  payload: { status, step },
  type: AT.SET_FIRMWARE_UPDATE_STEP
})
export const resetFirmwareInfo = () => ({
  type: AT.RESET_FIRMWARE_INFO
})
export const updateDeviceFirmware = (deviceIndex) => ({
  payload: { deviceIndex },
  type: AT.UPDATE_DEVICE_FIRMWARE
})

// DELETE
export const deleteDevice = (deviceIndex) => ({
  payload: { deviceIndex },
  type: AT.DELETE_DEVICE
})
export const deleteDeviceLoading = () => ({ type: AT.DELETE_DEVICE_LOADING })
export const deleteDeviceSuccess = () => ({ type: AT.DELETE_DEVICE_SUCCESS })
export const deleteDeviceFailure = (payload) => ({
  payload,
  type: AT.DELETE_DEVICE_FAILURE
})

// DASHBOARD
export const initializeDashboard = (deviceIndex) => ({
  payload: { deviceIndex, reset: true },
  type: AT.INITIALIZE_DASHBOARD
})
export const updateTransactionList = (deviceIndex) => ({
  payload: { deviceIndex },
  type: AT.UPDATE_TRANSACTION_LIST
})

// APPLICATIONS
export const initializeAppManager = (deviceIndex) => ({
  payload: { deviceIndex },
  type: AT.INITIALIZE_APP_MANAGER
})
export const setLatestAppInfosLoading = () => ({
  type: AT.SET_LATEST_APP_INFOS_LOADING
})
export const setLatestAppInfosFailure = () => ({
  type: AT.SET_LATEST_APP_INFOS_FAILURE
})
export const setLatestAppInfosSuccess = (appInfos) => ({
  payload: appInfos,
  type: AT.SET_LATEST_APP_INFOS_SUCCESS
})
export const installApplication = (appName) => ({
  payload: { appName },
  type: AT.INSTALL_APPLICATION
})
export const uninstallApplication = (appName) => ({
  payload: { appName },
  type: AT.UNINSTALL_APPLICATION
})
export const appChangeLoading = () => ({
  type: AT.APP_CHANGE_LOADING
})
export const appChangeSuccess = (appName, changeType) => ({
  payload: { appName, changeType },
  type: AT.APP_CHANGE_SUCCESS
})
export const appChangeFailure = (appName, changeType, error) => ({
  payload: { appName, changeType, error },
  type: AT.APP_CHANGE_FAILURE
})
export const resetAppChangeStatus = () => ({
  type: AT.RESET_APP_CHANGE_STATUS
})

// MISC
export const determineLockboxRoute = () => ({
  type: AT.DETERMINE_LOCKBOX_ROUTE
})
export const saveCoinMD = (deviceIndex, coin) => ({
  payload: { coin, deviceIndex },
  type: AT.SAVE_COIN_MD
})
export const lockboxModalClose = () => ({
  type: AT.LOCKBOX_MODAL_CLOSE
})
export const setProductTourVisibility = (visibility) => ({
  payload: visibility,
  type: AT.SET_PRODUCT_TOUR_VISIBILITY
})
