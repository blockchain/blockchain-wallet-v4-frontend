import { assoc } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  step: 1,
  loading: false,
  error: {}
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.EXCHANGE_INITIALIZED: {
      return INITIAL_STATE
    }
    case AT.EXCHANGE_SUBMIT_CLICKED: {
      const { step } = payload
      return assoc('step', step, state)
    }
    case AT.EXCHANGE_STATUS_LOADING: {
      return assoc('loading', true, state)
    }
    case AT.EXCHANGE_STATUS_LOADED: {
      return assoc('loading', false, state)
    }
    case AT.EXCHANGE_ERROR: {
      return assoc('error', payload, state)
    }
    default:
      return state
  }
}
