import * as AT from './actionTypes'
import { assoc } from 'ramda'

const INITIAL_STATE = {
  checkoutBusy: false
}

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
    case AT.COINIFY_SAVE_MEDIUM_SUCCESS: {
      return assoc('medium', payload, state)
    }
    case AT.COINIFY_CHECKOUT_BUSY_ON: {
      return assoc('checkoutBusy', true, state)
    }
    case AT.COINIFY_CHECKOUT_BUSY_OFF: {
      return assoc('checkoutBusy', false, state)
    }
    default:
      return state
  }
}

export default coinify
