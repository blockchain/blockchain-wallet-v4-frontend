import { path } from 'ramda'

// Device Setup
export const getNewDeviceSetupStep = path([
  'components',
  'lockbox',
  'newDeviceSetup',
  'currentStep'
])
export const getNewDeviceInfo = path([
  'components',
  'lockbox',
  'newDeviceSetup',
  'device'
])

// Device Connections
export const getTransportObject = path([
  'components',
  'lockbox',
  'connection',
  'transport'
])
export const getConnectedDevice = path([
  'components',
  'lockbox',
  'connection',
  'device'
])
