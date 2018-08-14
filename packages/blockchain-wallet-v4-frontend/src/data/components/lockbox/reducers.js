import { assocPath } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  newDeviceSetup: {
    currentStep: 'setup-type'
  },
  connection: {
    status: Remote.NotAsked,
    device: Remote.NotAsked
  }
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_CONNECT_STEP: {
      return assocPath(['newDeviceSetup', 'currentStep'], payload.step, state)
    }
    case AT.SET_CONNECTION_STATUS: {
      return assocPath(['connection', 'status'], Remote.Success(payload), state)
    }
    case AT.SET_NEW_DEVICE_ID: {
      return assocPath(['newDeviceSetup', 'deviceID'], payload.deviceID, state)
    }
    case AT.SET_NEW_DEVICE_NAME: {
      return assocPath(
        ['newDeviceSetup', 'deviceName'],
        payload.deviceName,
        state
      )
    }
    case AT.DEVICE_INFO_LOADING: {
      return assocPath(['connection', 'device'], Remote.Loading, state)
    }
    case AT.DEVICE_INFO_SUCCESS: {
      return assocPath(['connection', 'device'], Remote.Success(payload), state)
    }
    case AT.DEVICE_INFO_FAILURE: {
      return assocPath(['connection', 'device'], Remote.Failure(payload), state)
    }
    default:
      return state
  }
}
