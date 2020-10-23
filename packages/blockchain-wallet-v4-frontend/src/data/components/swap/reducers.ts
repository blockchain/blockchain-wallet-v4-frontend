import * as AT from './actionTypes'
import { SwapActionTypes, SwapState } from './types'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

const INITIAL_STATE: SwapState = {
  limits: Remote.NotAsked,
  payment: Remote.NotAsked,
  quote: Remote.NotAsked,
  side: 'BASE',
  step: 'INIT_SWAP',
  trades: {
    status: Remote.NotAsked,
    list: []
  }
}

export function swapReducer (
  state = INITIAL_STATE,
  action: SwapActionTypes
): SwapState {
  switch (action.type) {
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
          status: Remote.Success('Success'),
          list: [...state.trades.list, ...action.payload.trades]
        }
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
            step: action.payload.step,
            side: action.payload.options.side
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
