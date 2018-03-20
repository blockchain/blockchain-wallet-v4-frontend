import * as AT from './actionTypes'
import { assoc } from 'ramda'

const INITIAL_STATE = []

const coinify = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.COINIFY_NEXT_STEP: {
      return assoc('signupStep', payload, state)
    }
    case AT.COINIFY_SIGNUP_FAILURE: {
      return assoc('signupError', payload, state)
    }
    case AT.COINIFY_CLEAR_SIGNUP_ERROR: {
      return assoc('signupError', null, state)
    }
    case AT.COINIFY_SAVE_QUOTE: {
      return assoc('quote', payload, state)
    }
    default:
      return state
  }
}

export default coinify
