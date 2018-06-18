import { isNil, assoc } from 'ramda'
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
    case AT.SEND_BTC_INITIALIZED:
    case AT.SEND_BTC_DESTROYED: {
      return INITIAL_STATE
    }
    case AT.SEND_BTC_FIRST_STEP_TO_TOGGLED: {
      return assoc('toToggled', isNil(payload) ? !state.toToggled : payload, state)
    }
    case AT.SEND_BTC_FIRST_STEP_FEEPERBYTE_TOGGLED: {
      return assoc('feePerByteToggled', !state.feePerByteToggled, state)
    }
    case AT.SEND_BTC_PAYMENT_UPDATED_SUCCESS: {
      return assoc('payment', Remote.Success(payload), state)
    }
    case AT.SEND_BTC_PAYMENT_UPDATED_LOADING: {
      return assoc('payment', Remote.Loading, state)
    }
    case AT.SEND_BTC_PAYMENT_UPDATED_FAILURE: {
      return assoc('payment', Remote.Failure, state)
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
