import * as AT from './actionTypes'
import { InterestActionTypes, InterestState } from './types'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

const INITIAL_STATE: InterestState = {
  coin: 'BTC',
  interestEligible: Remote.NotAsked,
  interestInstruments: Remote.NotAsked,
  interestLimits: Remote.NotAsked
}

export function interestReducer (
  state = INITIAL_STATE,
  action: InterestActionTypes
): InterestState {
  switch (action.type) {
    case AT.FETCH_INTEREST_ELIGIBLE_FAILURE:
      return {
        ...state,
        interestEligible: Remote.Failure(action.payload.error)
      }
    case AT.FETCH_INTEREST_ELIGIBLE_LOADING:
      return {
        ...state,
        interestEligible: Remote.Loading
      }
    case AT.FETCH_INTEREST_ELIGIBLE_SUCCESS:
      return {
        ...state,
        interestEligible: Remote.Success(action.payload.interestEligible)
      }
    case AT.FETCH_INTEREST_INSTRUMENTS_FAILURE:
      return {
        ...state,
        interestInstruments: Remote.Failure(action.payload.error)
      }
    case AT.FETCH_INTEREST_INSTRUMENTS_LOADING:
      return {
        ...state,
        interestInstruments: Remote.Loading
      }
    case AT.FETCH_INTEREST_INSTRUMENTS_SUCCESS:
      return {
        ...state,
        interestInstruments: Remote.Success(action.payload.interestInstruments)
      }
    case AT.FETCH_INTEREST_LIMITS_FAILURE:
      return {
        ...state,
        interestLimits: Remote.Failure(action.payload.error)
      }
    case AT.FETCH_INTEREST_LIMITS_LOADING:
      return {
        ...state,
        interestLimits: Remote.Loading
      }
    case AT.FETCH_INTEREST_LIMITS_SUCCESS:
      return {
        ...state,
        interestLimits: Remote.Success(action.payload.interestLimits)
      }
    case AT.INITIALIZE_INTEREST: {
      return {
        ...state,
        coin: action.payload.coin
      }
    }

    default:
      return state
  }
}
