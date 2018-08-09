import { path } from 'ramda'

export const getNewDeviceSetupStep = path(['components', 'lockbox', 'newDeviceSetup', 'currentStep'])
export const getNewDeviceSetupId = path(['components', 'lockbox', 'newDeviceSetup', 'deviceID'])
export const getNewDeviceSetupName = path(['components', 'lockbox', 'newDeviceSetup', 'deviceName'])
export const getConnectedDevice = path(['components', 'lockbox', 'connectedDevice'])
