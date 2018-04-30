import * as AT from './actionTypes'
import { assoc } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

const INITIAL_STATE = {
  order: Remote.NotAsked
}

const sfoxSignup = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.NEXT_STEP: {
      return assoc('signupStep', payload, state)
    }
    case AT.SFOX_SIGNUP_FAILURE: {
      return assoc('signupError', payload, state)
    }
    case AT.CLEAR_SIGNUP_ERROR: {
      return assoc('signupError', null, state)
    }
    case AT.SET_VERIFY_ERROR: {
      return assoc('verifyError', payload, state)
    }
    case AT.ORDER_NOT_ASKED: {
      return assoc('order', Remote.NotAsked, state)
    }
    case AT.ORDER_LOADING: {
      return assoc('order', Remote.Loading, state)
    }
    case AT.ORDER_SUCCESS: {
      return assoc('order', Remote.Success(payload), state)
    }
    case AT.ORDER_FAILURE: {
      return assoc('order', Remote.Failure(payload), state)
    }
    default:
      return state
  }
}

export default sfoxSignup
