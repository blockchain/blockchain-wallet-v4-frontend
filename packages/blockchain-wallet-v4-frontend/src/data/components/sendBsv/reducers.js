import { isNil, assoc } from 'ramda'
import * as AT from './actionTypes'
import { Remote } from 'blockchain-wallet-v4/src'

const INITIAL_STATE = {
  step: 1,
  toToggled: false,
  payment: Remote.NotAsked
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SEND_BSV_INITIALIZED:
    case AT.SEND_BSV_DESTROYED: {
      return INITIAL_STATE
    }
    case AT.SEND_BSV_FIRST_STEP_TO_TOGGLED: {
      return assoc(
        'toToggled',
        isNil(payload) ? !state.toToggled : payload,
        state
      )
    }
    case AT.SEND_BSV_PAYMENT_UPDATED: {
      return assoc('payment', payload, state)
    }
    case AT.SEND_BSV_FIRST_STEP_SUBMIT_CLICKED: {
      return assoc('step', 2, state)
    }
    case AT.SEND_BSV_SECOND_STEP_CANCEL_CLICKED: {
      return assoc('step', 1, state)
    }
    default:
      return state
  }
}
