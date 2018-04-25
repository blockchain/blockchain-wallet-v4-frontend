import { assoc } from 'ramda'
import * as AT from './actionTypes'
import { Remote } from 'blockchain-wallet-v4/src'

const INITIAL_STATE = {
  step: 1,
  payment: Remote.NotAsked
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SEND_ETH_INITIALIZED: {
      return INITIAL_STATE
    }
    case AT.SEND_ETH_PAYMENT_UPDATED: {
      return assoc('payment', payload, state)
    }
    case AT.SEND_ETH_FIRST_STEP_SUBMIT_CLICKED: {
      return assoc('step', 2, state)
    }
    case AT.SEND_ETH_SECOND_STEP_CANCEL_CLICKED: {
      return assoc('step', 1, state)
    }
    default:
      return state
  }
}
