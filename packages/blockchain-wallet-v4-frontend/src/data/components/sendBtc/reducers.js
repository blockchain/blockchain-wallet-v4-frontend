import { assoc } from 'ramda'
import * as AT from './actionTypes'
import { Remote } from 'blockchain-wallet-v4/src'

const INITIAL_STATE = {
  step: 1,
  toToggled: false,
  feePerByteToggled: false,
  payment: Remote.NotAsked
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SEND_BTC_INITIALIZED: {
      return INITIAL_STATE
    }
    case AT.SEND_BTC_FIRST_STEP_TO_TOGGLED: {
      return assoc('toToggled', !state.toToggled, state)
    }
    case AT.SEND_BTC_FIRST_STEP_FEEPERBYTE_TOGGLED: {
      return assoc('feePerByteToggled', !state.feePerByteToggled, state)
    }
    case AT.SEND_BTC_PAYMENT_UPDATED: {
      return assoc('payment', payload, state)
    }
    case AT.SEND_BTC_FIRST_STEP_SUBMIT_CLICKED: {
      return assoc('step', 2, state)
    }
    case AT.SEND_BTC_SECOND_STEP_CANCEL_CLICKED: {
      return assoc('step', 1, state)
    }
    default:
      return state
  }
}
