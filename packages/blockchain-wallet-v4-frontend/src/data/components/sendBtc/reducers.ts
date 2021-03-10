import { assoc } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'

import * as AT from './actionTypes'
import { SendBtcState } from './types'

const INITIAL_STATE: SendBtcState = {
  step: 1,
  feePerByteToggled: false,
  payment: Remote.NotAsked
}

export function sendBtcReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AT.SEND_BTC_INITIALIZED:
    case AT.SEND_BTC_DESTROYED: {
      return INITIAL_STATE
    }
    case AT.SEND_BTC_FIRST_STEP_FEEPERBYTE_TOGGLED: {
      return assoc('feePerByteToggled', !state.feePerByteToggled, state)
    }
    case AT.SEND_BTC_PAYMENT_UPDATED_SUCCESS: {
      return assoc('payment', Remote.Success(action.payload), state)
    }
    case AT.SEND_BTC_PAYMENT_UPDATED_LOADING: {
      return assoc('payment', Remote.Loading, state)
    }
    case AT.SEND_BTC_PAYMENT_UPDATED_FAILURE: {
      return assoc('payment', Remote.Failure(action.payload), state)
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
