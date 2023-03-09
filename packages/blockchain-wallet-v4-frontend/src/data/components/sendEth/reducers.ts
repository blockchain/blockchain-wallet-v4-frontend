import { assoc } from 'ramda'

import { Remote } from '@core'

import * as AT from './actionTypes'
import { SendEthState } from './types'

const INITIAL_STATE: SendEthState = {
  feeToggled: false,
  isContract: Remote.NotAsked,
  maxCustodialWithdrawalFee: Remote.NotAsked,
  payment: Remote.NotAsked,
  sendLimits: Remote.NotAsked,
  step: 1
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
    case AT.SEND_ETH_FETCH_MAX_CUSTODIAL_WITHDRAWAL_FEE_SUCCESS: {
      return assoc('maxCustodialWithdrawalFee', Remote.Success(action.payload), state)
    }
    case AT.SEND_ETH_FETCH_MAX_CUSTODIAL_WITHDRAWAL_FEE_LOADING: {
      return assoc('maxCustodialWithdrawalFee', Remote.Loading, state)
    }
    case AT.SEND_ETH_FETCH_MAX_CUSTODIAL_WITHDRAWAL_FEE_FAILURE: {
      return assoc('maxCustodialWithdrawalFee', Remote.Failure(action.payload), state)
    }
    case AT.CLEAR_SEND_ETH_MAX_CUSTODIAL_WITHDRAWAL_FEE: {
      return assoc('maxCustodialWithdrawalFee', Remote.NotAsked, state)
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
    case AT.SEND_ETH_FETCH_LIMITS_LOADING: {
      return assoc('sendLimits', Remote.Loading, state)
    }
    case AT.SEND_ETH_FETCH_LIMITS_SUCCESS: {
      return assoc('sendLimits', Remote.Success(payload), state)
    }
    case AT.SEND_ETH_FETCH_LIMITS_FAILURE: {
      return assoc('sendLimits', Remote.Failure(payload), state)
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
