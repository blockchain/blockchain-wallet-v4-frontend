import { assoc } from 'ramda'

import { Remote } from '@core'

import * as AT from './actionTypes'
import { SendBchState } from './types'

const INITIAL_STATE: SendBchState = {
  payment: Remote.NotAsked,
  sendLimits: Remote.NotAsked,
  step: 1
}

export function sendBchReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AT.SEND_BCH_INITIALIZED:
    case AT.SEND_BCH_DESTROYED: {
      return INITIAL_STATE
    }
    case AT.SEND_BCH_PAYMENT_UPDATED_LOADING: {
      return assoc('payment', Remote.Loading, state)
    }
    case AT.SEND_BCH_PAYMENT_UPDATED_SUCCESS: {
      return assoc('payment', Remote.Success(action.payload), state)
    }
    case AT.SEND_BCH_PAYMENT_UPDATED_FAILURE: {
      return assoc('payment', Remote.Failure(action.payload), state)
    }
    case AT.SEND_BCH_FIRST_STEP_SUBMIT_CLICKED: {
      return assoc('step', 2, state)
    }
    case AT.SEND_BCH_SECOND_STEP_CANCEL_CLICKED: {
      return assoc('step', 1, state)
    }
    case AT.SEND_BCH_FETCH_LIMITS_LOADING: {
      return assoc('sendLimits', Remote.Loading, state)
    }
    case AT.SEND_BCH_FETCH_LIMITS_SUCCESS: {
      return assoc('sendLimits', Remote.Success(action.payload), state)
    }
    case AT.SEND_BCH_FETCH_LIMITS_FAILURE: {
      return assoc('sendLimits', Remote.Failure(action.payload), state)
    }
    default:
      return state
  }
}
