import { assoc, assocPath, merge } from 'ramda'
import * as AT from './actionTypes'
import { Remote } from 'blockchain-wallet-v4/src'

const INITIAL_STATE = {
  step: 1,
  firstStep: {
    loading: false,
    error: {}
  },
  secondStep: Remote.NotAsked
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.EXCHANGE_INITIALIZED:
    case AT.EXCHANGE_DESTROYED: {
      return INITIAL_STATE
    }
    case AT.EXCHANGE_FIRST_STEP_LOADING: {
      return assocPath(['firstStep', 'loading'], true, state)
    }
    case AT.EXCHANGE_FIRST_STEP_LOADED: {
      return assocPath(['firstStep', 'loading'], false, state)
    }
    case AT.EXCHANGE_FIRST_STEP_ERROR: {
      return assocPath(['firstStep', 'error'], payload, state)
    }
    case AT.EXCHANGE_SECOND_STEP_INITIALIZED: {
      return merge(state, {
        step: 2,
        secondStep: Remote.Loading
      })
    }
    case AT.EXCHANGE_SECOND_STEP_SUCCESS: {
      return assoc('secondStep', Remote.Success(payload), state)
    }
    case AT.EXCHANGE_SECOND_STEP_FAILURE: {
      return assoc('secondStep', Remote.Failure(payload), state)
    }
    case AT.EXCHANGE_THIRD_STEP_INITIALIZED: {
      return assoc('step', 3, state)
    }
    default:
      return state
  }
}
