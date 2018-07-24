import * as AT from './actionTypes'
import { assoc } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

const INITIAL_STATE = {
  sfoxBusy: Remote.NotAsked,
  qaSellAddress: null
}

const sfoxSignup = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.NEXT_STEP: {
      return assoc('signupStep', payload, state)
    }
    case AT.SET_VERIFY_ERROR: {
      return assoc('verifyError', payload, state)
    }
    case AT.SFOX_NOT_ASKED: {
      return assoc('sfoxBusy', Remote.NotAsked, state)
    }
    case AT.SFOX_LOADING: {
      return assoc('sfoxBusy', Remote.Loading, state)
    }
    case AT.SFOX_SUCCESS: {
      return assoc('sfoxBusy', Remote.Success(payload), state)
    }
    case AT.SFOX_FAILURE: {
      return assoc('sfoxBusy', Remote.Failure(payload), state)
    }
    default:
      return state
  }
}

export default sfoxSignup
