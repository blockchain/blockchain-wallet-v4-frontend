import { assocPath } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  connection: {},
  firmware: {},
  newDeviceSetup: {
    currentStep: 'setup-type',
    device: Remote.NotAsked
  }
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.RESET_CONNECTION_STATUS: {
      return assocPath(['connection'], {}, state)
    }
    case AT.SET_CONNECT_STEP: {
      return assocPath(['newDeviceSetup', 'currentStep'], payload.step, state)
    }
    case AT.SET_CONNECTION_INFO: {
      return assocPath(['connection'], payload, state)
    }
    case AT.SET_CONNECTION_ERROR: {
      return assocPath(['connection', 'error'], payload.error, state)
    }
    case AT.SET_NEW_DEVICE_INFO: {
      return assocPath(
        ['newDeviceSetup', 'device'],
        Remote.Success(payload.deviceInfo),
        state
      )
    }
    default:
      return state
  }
}
