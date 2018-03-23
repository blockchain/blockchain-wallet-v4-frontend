import { assoc } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  step: 1
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.EXCHANGE_INITIALIZED: {
      return assoc('step', 1, state)
    }
    case AT.EXCHANGE_SUBMIT_CLICKED: {
      const { step } = payload
      return assoc('step', step, state)
    }
    default:
      return state
  }
}
