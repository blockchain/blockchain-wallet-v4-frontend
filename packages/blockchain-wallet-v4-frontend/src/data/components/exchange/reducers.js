import { assoc, merge } from 'ramda'
import * as AT from './actionTypes'
import { Remote } from 'blockchain-wallet-v4'
import { EXCHANGE_STEPS } from './model'

const INITIAL_STATE = {
  step: EXCHANGE_STEPS.EXCHANGE_FORM,
  secondStep: Remote.NotAsked,
  error: 'initial',
  payment: {},
  order: {},
  firstStepEnabled: true,
  limits: Remote.NotAsked
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.EXCHANGE_ORDER_UPDATED: {
      return assoc('order', payload, state)
    }
    case AT.EXCHANGE_PAYMENT_UPDATED: {
      return assoc('payment', payload, state)
    }
    case AT.EXCHANGE_FIRST_STEP_ENABLED: {
      return assoc('firstStepEnabled', true, state)
    }
    case AT.EXCHANGE_FIRST_STEP_DISABLED: {
      return assoc('firstStepEnabled', false, state)
    }
    case AT.EXCHANGE_FIRST_STEP_FORM_VALIDATED: {
      return assoc('error', '', state)
    }
    case AT.EXCHANGE_FIRST_STEP_FORM_UNVALIDATED: {
      return assoc('error', payload, state)
    }
    case AT.EXCHANGE_FIRST_STEP_SUBMIT_CLICKED: {
      return assoc('step', EXCHANGE_STEPS.CONFIRM, state)
    }
    case AT.EXCHANGE_SECOND_STEP_INITIALIZED: {
      return assoc('secondStep', Remote.Loading, state)
    }
    case AT.EXCHANGE_SECOND_STEP_SUCCESS: {
      return assoc('secondStep', Remote.Success(payload), state)
    }
    case AT.EXCHANGE_SECOND_STEP_FAILURE: {
      return assoc('secondStep', Remote.Failure(payload), state)
    }
    case AT.EXCHANGE_SECOND_STEP_ORDER_EXPIRED:
    case AT.EXCHANGE_SECOND_STEP_CANCEL_CLICKED: {
      return INITIAL_STATE
    }
    case AT.EXCHANGE_SECOND_STEP_PAYMENT_SENT: {
      return merge(state, {
        step: EXCHANGE_STEPS.EXCHANGE_RESULT,
        payment: payload
      })
    }
    case AT.EXCHANGE_SECOND_STEP_GOBACK:
    case AT.EXCHANGE_DESTROYED:
    case AT.EXCHANGE_THIRD_STEP_CLOSE_CLICKED: {
      return INITIAL_STATE
    }
    case AT.SET_STEP: {
      return EXCHANGE_STEPS.EXCHANGE_FORM
    }
    case AT.FETCH_LIMITS_LOADING:
      return assoc('limits', Remote.Loading, state)
    case AT.FETCH_LIMITS_SUCCESS:
      return assoc('limits', Remote.Success(payload.limits), state)
    case AT.FETCH_LIMITS_ERROR:
      return assoc('limits', Remote.Failure(payload.error), state)
    default:
      return state
  }
}
