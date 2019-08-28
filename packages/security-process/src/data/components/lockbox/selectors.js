import { path } from 'ramda'

// New Device Setup
export const getNewDeviceSetupStep = path([
  'components',
  'lockbox',
  'newDeviceSetup',
  'currentStep'
])
export const getNewDeviceSetupType = path([
  'components',
  'lockbox',
  'newDeviceSetup',
  'newOrExisting'
])
export const getNewDeviceShowBtcWarning = path([
  'components',
  'lockbox',
  'newDeviceSetup',
  'showBtcWarning'
])
export const getNewDeviceType = path([
  'components',
  'lockbox',
  'newDeviceSetup',
  'deviceType'
])
export const getNewDeviceInfo = path([
  'components',
  'lockbox',
  'newDeviceSetup',
  'device'
])

// Device Connections
export const getCurrentConnection = path([
  'components',
  'lockbox',
  'connection'
])

// Firmware
export const getFirmwareUpdateStep = path(['components', 'lockbox', 'firmware'])

// Application Installs
export const getDeviceTargetId = path([
  'components',
  'lockbox',
  'appManager',
  'targetId'
])
export const getLatestApplicationVersions = path([
  'components',
  'lockbox',
  'appManager',
  'latestAppInfos'
])
export const getAppChangeStatus = path([
  'components',
  'lockbox',
  'appManager',
  'appChangeStatus'
])

// Misc
export const getProductTourVisibility = path([
  'components',
  'lockbox',
  'showProductTour'
])
