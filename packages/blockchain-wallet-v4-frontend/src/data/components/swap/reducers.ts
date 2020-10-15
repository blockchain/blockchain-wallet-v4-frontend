import * as AT from './actionTypes'
import { SwapActionTypes, SwapState } from './types'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

const INITIAL_STATE: SwapState = {
  quote: Remote.NotAsked,
  side: 'BASE',
  step: 'INIT_SWAP'
}

export function swapReducer (
  state = INITIAL_STATE,
  action: SwapActionTypes
): SwapState {
  switch (action.type) {
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
