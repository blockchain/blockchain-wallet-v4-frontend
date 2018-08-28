import { assocPath } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  newDeviceSetup: {
    currentStep: 'setup-type',
    device: Remote.NotAsked
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
    case AT.STORE_TRANSPORT_OBJECT: {
      return assocPath(['connection', 'transport'], payload.transport, state)
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
