import { assoc } from 'ramda'

import { Remote } from '@core'

import * as AT from './actionTypes'

const INITIAL_STATE = {
  checkDestination: Remote.NotAsked,
  feeToggled: false,
  isDestinationExchange: Remote.NotAsked,
  payment: Remote.NotAsked,
  sendLimits: Remote.NotAsked,
  showNoAccountForm: false,
  step: 1
}

export function sendXlmReducer(state = INITIAL_STATE, action) {
  const { payload, type } = action

  switch (type) {
    case AT.SEND_XLM_INITIALIZED:
    case AT.SEND_XLM_DESTROYED: {
      return INITIAL_STATE
    }
    case AT.SEND_XLM_PAYMENT_UPDATED_LOADING: {
      return assoc('payment', Remote.Loading, state)
    }
    case AT.SEND_XLM_PAYMENT_UPDATED_SUCCESS: {
      return assoc('payment', Remote.Success(payload), state)
    }
    case AT.SEND_XLM_PAYMENT_UPDATED_FAILURE: {
      return assoc('payment', Remote.Failure(payload), state)
    }
    case AT.SEND_XLM_CHECK_DESTINATION_ACCOUNT_EXISTS_LOADING: {
      return assoc('checkDestination', Remote.Loading, state)
    }
    case AT.SEND_XLM_CHECK_DESTINATION_ACCOUNT_EXISTS_SUCCESS: {
      return assoc('checkDestination', Remote.Success(payload), state)
    }
    case AT.SEND_XLM_CHECK_DESTINATION_ACCOUNT_EXISTS_FAILURE: {
      return assoc('checkDestination', Remote.Failure(payload), state)
    }
    case AT.SEND_XLM_CHECK_IF_DESTINATION_IS_EXCHANGE_LOADING: {
      return assoc('isDestinationExchange', Remote.Loading, state)
    }
    case AT.SEND_XLM_CHECK_IF_DESTINATION_IS_EXCHANGE_SUCCESS: {
      return assoc('isDestinationExchange', Remote.Success(payload), state)
    }
    case AT.SEND_XLM_CHECK_IF_DESTINATION_IS_EXCHANGE_FAILURE: {
      return assoc('isDestinationExchange', Remote.Failure(payload), state)
    }
    case AT.SEND_XLM_FIRST_STEP_SUBMIT_CLICKED: {
      return assoc('step', 2, state)
    }
    case AT.SEND_XLM_SECOND_STEP_CANCEL_CLICKED: {
      return assoc('step', 1, state)
    }
    case AT.SEND_XLM_FIRST_STEP_FEE_TOGGLED: {
      return assoc('feeToggled', !state.feeToggled, state)
    }
    case AT.SEND_XLM_SHOW_NO_ACCOUNT_FORM: {
      return assoc('showNoAccountForm', payload.shouldShow, state)
    }
    case AT.SEND_XLM_FETCH_LIMITS_LOADING: {
      return assoc('sendLimits', Remote.Loading, state)
    }
    case AT.SEND_XLM_FETCH_LIMITS_SUCCESS: {
      return assoc('sendLimits', Remote.Success(payload), state)
    }
    case AT.SEND_XLM_FETCH_LIMITS_FAILURE: {
      return assoc('sendLimits', Remote.Failure(payload), state)
    }
    default:
      return state
  }
}
