import { path } from 'ramda'

// New Device Setup
export const getNewDeviceSetupStep = path([
  'components',
  'lockbox',
  'newDeviceSetup',
  'currentStep'
])
export const getNewDeviceAuthenticity = path([
  'components',
  'lockbox',
  'newDeviceSetup',
  'isAuthentic'
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
export const getFirmwareUpdateStep = path([
  'components',
  'lockbox',
  'firmware',
  'step'
])
export const getFirmwareVersions = path([
  'components',
  'lockbox',
  'firmware',
  'versions'
])

// Application Installs
export const getApplicationInstalls = path([
  'components',
  'lockbox',
  'installs',
  'apps'
])

// TODO: remove once app store is introduced
export const getBlockchainInstall = path([
  'components',
  'lockbox',
  'installs',
  'blockchain'
])
