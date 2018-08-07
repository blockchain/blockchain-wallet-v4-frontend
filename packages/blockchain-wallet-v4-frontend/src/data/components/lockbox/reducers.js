import { assoc } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  step: 'setup-type',
  deviceInfo: Remote.NotAsked
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_CONNECT_STEP: {
      return assoc('step', payload.step, state)
    }
    case AT.DEVICE_INFO_LOADING: {
      return assoc('deviceInfo', Remote.Loading, state)
    }
    case AT.DEVICE_INFO_SUCCESS: {
      return assoc('deviceInfo', Remote.Success(payload), state)
    }
    case AT.DEVICE_INFO_FAILURE: {
      return assoc('deviceInfo', Remote.Failure(payload), state)
    }
    default:
      return state
  }
}
