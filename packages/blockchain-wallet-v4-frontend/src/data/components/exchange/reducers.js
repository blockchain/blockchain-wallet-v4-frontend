import { assoc, merge } from 'ramda'
import * as AT from './actionTypes'
import { Remote } from 'blockchain-wallet-v4/src'

const INITIAL_STATE = {
  step: 1,
  accounts: [],
  minimum: 0,
  maximum: 0,
  error: 'insufficient',
  payment: {},
  order: Remote.NotAsked,
  firstStepEnabled: true
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.EXCHANGE_INITIALIZED:
    case AT.EXCHANGE_DESTROYED: {
      return INITIAL_STATE
    }
    case AT.EXCHANGE_PAYMENT_UPDATED: {
      return assoc('payment', payload, state)
    }
    case AT.EXCHANGE_ACCOUNTS_UPDATED: {
      return assoc('accounts', payload, state)
    }
    case AT.EXCHANGE_LIMITS_UPDATED: {
      const { minimum, maximum } = payload
      return merge(state, { minimum, maximum })
    }
    case AT.EXCHANGE_FIRST_STEP_INITIALIZED: {
      return state
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
      // return assoc('step', 2, state)
      return state
    }
    // case AT.EXCHANGE_SECOND_STEP_INITIALIZED: {
    //   return merge(state, {
    //     step: 2,
    //     order: Remote.Loading
    //   })
    // }
    // case AT.EXCHANGE_SECOND_STEP_SUCCESS: {
    //   return assoc('order', Remote.Success(payload), state)
    // }
    // case AT.EXCHANGE_SECOND_STEP_FAILURE: {
    //   return assoc('order', Remote.Failure(payload), state)
    // }
    // case AT.EXCHANGE_THIRD_STEP_INITIALIZED: {
    //   return assoc('step', 3, state)
    // }
    default:
      return state
  }
}
