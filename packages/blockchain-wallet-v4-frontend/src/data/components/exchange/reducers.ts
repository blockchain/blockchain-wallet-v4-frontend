import * as AT from 'data/components/exchange/actionTypes'
import { assoc, compose } from 'ramda'
import { ExchangeActionTypes, ExchangeState } from './types'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

const INITIAL_STATE: ExchangeState = {
  limits: Remote.NotAsked,
  min: null,
  max: null,
  // @PHIL how to solve for default state for all these, 15-28
  sourceFee: {
    isSourceErc20: false,
    mempoolFees: {
      limits: {
        max: 0,
        min: 0
      },
      priority: 0,
      regular: 0
    },
    source: 0,
    sourceFiat: '',
    target: 0
  },
  showError: false,
  txError: null
}

export function exchangeReducer (
  state = INITIAL_STATE,
  action: ExchangeActionTypes
): ExchangeState {
  switch (action.type) {
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
    case AT.FETCH_LIMITS_ERROR: {
      return {
        ...state,
        limits: Remote.Failure(action.payload.error)
      }
    }
    case AT.SET_MIN_MAX: {
      return {
        ...state,
        min: action.payload.min,
        max: action.payload.max
      }
    }
    case AT.SET_SOURCE_FEE: {
      return {
        ...state,
        sourceFee: action.payload.fee
      }
    }
    case AT.SET_SHOW_ERROR: {
      return {
        ...state,
        showError: action.payload.showError
      }
    }
    case AT.SET_TX_ERROR: {
      return {
        ...state,
        txError: action.payload.error
      }
    }
    default:
      return state
  }
}
