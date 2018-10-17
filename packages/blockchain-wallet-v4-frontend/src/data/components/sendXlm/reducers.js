import { assoc, isNil } from 'ramda'
import * as AT from './actionTypes'
import { Remote } from 'blockchain-wallet-v4/src'

const INITIAL_STATE = {
  step: 1,
  payment: Remote.NotAsked,
  toToggled: false,
  feeToggled: false
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.INITIALIZED:
    case AT.DESTROYED: {
      return INITIAL_STATE
    }
    case AT.PAYMENT_UPDATED: {
      return assoc('payment', payload, state)
    }
    case AT.FIRST_STEP_SUBMIT_CLICKED: {
      return assoc('step', 2, state)
    }
    case AT.SECOND_STEP_CANCEL_CLICKED: {
      return assoc('step', 1, state)
    }
    case AT.FIRST_STEP_TO_TOGGLED: {
      return assoc(
        'toToggled',
        isNil(payload) ? !state.toToggled : payload,
        state
      )
    }
    case AT.FIRST_STEP_FEE_TOGGLED: {
      return assoc('feeToggled', !state.feeToggled, state)
    }
    default:
      return state
  }
}
