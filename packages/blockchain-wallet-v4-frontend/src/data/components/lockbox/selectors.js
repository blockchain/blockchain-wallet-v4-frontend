import { path } from 'ramda'

// Device Setup
export const getNewDeviceSetupStep = path([
  'components',
  'lockbox',
  'newDeviceSetup',
  'currentStep'
])
export const getNewDeviceSetupId = path([
  'components',
  'lockbox',
  'newDeviceSetup',
  'deviceID'
])
export const getNewDeviceSetupName = path([
  'components',
  'lockbox',
  'newDeviceSetup',
  'deviceName'
])

// Device Connections
export const getConnectedDevice = path([
  'components',
  'lockbox',
  'connection',
  'status'
])
export const getConnectionStatus = path([
  'components',
  'lockbox',
  'connection',
  'device'
])
