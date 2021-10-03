import Remote from 'blockchain-wallet-v4/src/remote/remote'

import * as AT from './actionTypes'
import { SwapActionTypes, SwapState } from './types'

const INITIAL_STATE: SwapState = {
  custodialEligibility: Remote.NotAsked,
  fix: 'FIAT',
  limits: Remote.NotAsked,
  order: undefined,
  pairs: Remote.NotAsked,
  payment: Remote.NotAsked,
  quote: Remote.NotAsked,
  side: 'BASE',
  step: 'INIT_SWAP',
  trades: {
    list: [],
    status: Remote.NotAsked
  }
}

const swapReducer = (state = INITIAL_STATE, action: SwapActionTypes): SwapState => {
  switch (action.type) {
    case AT.FETCH_CUSTODIAL_ELIGIBILITY_FAILURE: {
      return {
        ...state,
        custodialEligibility: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_CUSTODIAL_ELIGIBILITY_LOADING: {
      return {
        ...state,
        custodialEligibility: Remote.Loading
      }
    }
    case AT.FETCH_CUSTODIAL_ELIGIBILITY_SUCCESS: {
      return {
        ...state,
        custodialEligibility: Remote.Success(action.payload.eligibility)
      }
    }
    case AT.FETCH_LIMITS_FAILURE: {
      return {
        ...state,
        limits: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_LIMITS_LOADING: {
      return {
        ...state,
        limits: Remote.Loading
      }
    }
    case AT.FETCH_LIMITS_SUCCESS: {
      return {
        ...state,
        limits: Remote.Success(action.payload.limits)
      }
    }
    case AT.FETCH_PAIRS_FAILURE: {
      return {
        ...state,
        pairs: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_PAIRS_LOADING: {
      return {
        ...state,
        pairs: Remote.Loading
      }
    }
    case AT.FETCH_PAIRS_SUCCESS: {
      return {
        ...state,
        pairs: Remote.Success(action.payload.pairs)
      }
    }
    case AT.FETCH_QUOTE_FAILURE: {
      return {
        ...state,
        quote: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_QUOTE_LOADING: {
      return {
        ...state,
        quote: Remote.Loading
      }
    }
    case AT.FETCH_QUOTE_SUCCESS: {
      return {
        ...state,
        quote: Remote.Success(action.payload)
      }
    }
    case AT.FETCH_TRADES_FAILURE: {
      return {
        ...state,
        trades: {
          ...state.trades,
          status: Remote.Failure(action.payload.error)
        }
      }
    }
    case AT.FETCH_TRADES_LOADING: {
      return {
        ...state,
        trades: {
          ...state.trades,
          status: Remote.Loading
        }
      }
    }
    case AT.FETCH_TRADES_SUCCESS: {
      return {
        ...state,
        trades: {
          ...state.trades,
          list: [...state.trades.list, ...action.payload.trades],
          status: Remote.Success('Success')
        }
      }
    }
    case AT.SET_CHECKOUT_FIX: {
      return {
        ...state,
        fix: action.payload.fix
      }
    }
    case AT.UPDATE_PAYMENT_FAILURE: {
      return {
        ...state,
        payment: Remote.Failure(action.payload.error)
      }
    }
    case AT.UPDATE_PAYMENT_LOADING: {
      return {
        ...state,
        payment: Remote.Loading
      }
    }
    case AT.UPDATE_PAYMENT_SUCCESS: {
      return {
        ...state,
        payment: Remote.Success(action.payload.payment)
      }
    }
    case AT.SET_STEP:
      switch (action.payload.step) {
        case 'COIN_SELECTION':
          return {
            ...state,
            side: action.payload.options.side,
            step: action.payload.step
          }
        case 'SUCCESSFUL_SWAP':
        case 'ORDER_DETAILS':
          return {
            ...state,
            order: action.payload.options.order,
            step: action.payload.step
          }
        default: {
          return {
            ...state,
            step: action.payload.step
          }
        }
      }
    default:
      return state
  }
}

export default swapReducer
