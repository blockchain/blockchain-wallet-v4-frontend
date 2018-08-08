import { assoc, assocPath } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  newDeviceSetup: {
    currentStep: 'setup-type'
  },
  connectedDevice: Remote.NotAsked
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_CONNECT_STEP: {
      return assocPath(['newDeviceSetup', 'currentStep'], payload.step, state)
    }
    case AT.SET_NEW_DEVICE_ID: {
      return assocPath(['newDeviceSetup', 'deviceID'], payload.deviceID, state)
    }
    case AT.SET_NEW_DEVICE_NAME: {
      return assocPath(['newDeviceSetup', 'deviceName'], payload.deviceName, state)
    }
    case AT.SET_NEW_DEVICE_ACCOUNTS: {
      return assocPath(['newDeviceSetup', 'device', 'accounts'], payload.accounts, state)
    }
    case AT.DEVICE_INFO_LOADING: {
      return assoc('connectedDevice', Remote.Loading, state)
    }
    case AT.DEVICE_INFO_SUCCESS: {
      return assoc('connectedDevice', Remote.Success(payload), state)
    }
    case AT.DEVICE_INFO_FAILURE: {
      return assoc('connectedDevice', Remote.Failure(payload), state)
    }
    default:
      return state
  }
}
