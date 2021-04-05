import { assoc } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'

import * as AT from './actionTypes'
import { SendEthState } from './types'

const INITIAL_STATE: SendEthState = {
  step: 1,
  isContract: Remote.NotAsked,
  payment: Remote.NotAsked,
  feeToggled: false
}

export function sendEthReducer(state = INITIAL_STATE, action) {
  const { payload, type } = action

  switch (type) {
    case AT.SEND_ETH_INITIALIZED:
    case AT.SEND_ETH_DESTROYED: {
      return INITIAL_STATE
    }
    case AT.SEND_ETH_PAYMENT_UPDATED_LOADING: {
      return assoc('payment', Remote.Loading, state)
    }
    case AT.SEND_ETH_PAYMENT_UPDATED_SUCCESS: {
      return assoc('payment', Remote.Success(payload), state)
    }
    case AT.SEND_ETH_PAYMENT_UPDATED_FAILURE: {
      return assoc('payment', Remote.Failure(payload), state)
    }
    case AT.SEND_ETH_CHECK_IS_CONTRACT_LOADING: {
      return assoc('isContract', Remote.Loading, state)
    }
    case AT.SEND_ETH_CHECK_IS_CONTRACT_SUCCESS: {
      return assoc('isContract', Remote.Success(payload), state)
    }
    case AT.SEND_ETH_CHECK_IS_CONTRACT_FAILURE: {
      return assoc('isContract', Remote.Failure(payload), state)
    }
    case AT.SEND_ETH_FIRST_STEP_SUBMIT_CLICKED: {
      return assoc('step', 2, state)
    }
    case AT.SEND_ETH_SECOND_STEP_CANCEL_CLICKED: {
      return assoc('step', 1, state)
    }
    case AT.SEND_ETH_FIRST_STEP_FEE_TOGGLED: {
      return assoc('feeToggled', !state.feeToggled, state)
    }
    default:
      return state
  }
}
