import * as AT from './actionTypes'
import { SimpleBuyActionTypes, SimpleBuyState } from './types'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

const INITIAL_STATE: SimpleBuyState = {
  fiatEligible: Remote.NotAsked,
  pairs: Remote.NotAsked
}

export function simpleBuyReducer (
  state = INITIAL_STATE,
  action: SimpleBuyActionTypes
): SimpleBuyState {
  switch (action.type) {
    case AT.FETCH_SB_FIAT_ELIGIBLE_FAILURE: {
      return {
        ...state,
        fiatEligible: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_SB_FIAT_ELIGIBLE_LOADING:
      return {
        ...state,
        fiatEligible: Remote.Loading
      }
    case AT.FETCH_SB_FIAT_ELIGIBLE_SUCCESS:
      return {
        ...state,
        fiatEligible: Remote.Success(action.payload.fiatEligible)
      }
    case AT.FETCH_SB_PAIRS_FAILURE: {
      return {
        ...state,
        pairs: Remote.Failure(action.payload.error)
      }
    }
    case AT.FETCH_SB_PAIRS_LOADING:
      return {
        ...state,
        pairs: Remote.Loading
      }
    case AT.FETCH_SB_PAIRS_SUCCESS:
      return {
        ...state,
        pairs: Remote.Success(action.payload.pairs)
      }
    default:
      return state
  }
}
