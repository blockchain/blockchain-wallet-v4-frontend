import * as AT from './actionTypes'
import { InterestActionTypes, InterestState } from './types'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

const INITIAL_STATE: InterestState = {
  account: Remote.NotAsked,
  interestAccountBalance: Remote.NotAsked,
  coin: 'BTC',
  interestEligible: Remote.NotAsked,
  interestInstruments: Remote.NotAsked,
  interestLimits: Remote.NotAsked,
  interestRate: Remote.NotAsked,
  interestTransactions: Remote.NotAsked,
  step: 'DEPOSIT'
}

export function interestReducer (
  state = INITIAL_STATE,
  action: InterestActionTypes
): InterestState {
  switch (action.type) {
    case AT.FETCH_INTEREST_BALANCE_FAILURE:
      return {
        ...state,
        interestAccountBalance: Remote.Failure(action.payload.error)
      }
    case AT.FETCH_INTEREST_BALANCE_LOADING:
      return {
        ...state,
        interestAccountBalance: Remote.Loading
      }
    case AT.FETCH_INTEREST_BALANCE_SUCCESS:
      return {
        ...state,
        interestAccountBalance: Remote.Success(
          action.payload.interestAccountBalance
        )
      }
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
    case AT.FETCH_INTEREST_PAYMENT_ACCOUNT_FAILURE:
      return {
        ...state,
        account: Remote.Failure(action.payload.error)
      }
    case AT.FETCH_INTEREST_PAYMENT_ACCOUNT_LOADING:
      return {
        ...state,
        account: Remote.Loading
      }
    case AT.FETCH_INTEREST_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        account: Remote.Success(action.payload.account)
      }
    case AT.FETCH_INTEREST_RATE_FAILURE:
      return {
        ...state,
        interestRate: Remote.Failure(action.payload.error)
      }
    case AT.FETCH_INTEREST_RATE_LOADING:
      return {
        ...state,
        interestRate: Remote.Loading
      }
    case AT.FETCH_INTEREST_RATE_SUCCESS:
      return {
        ...state,
        interestRate: Remote.Success(action.payload.interestRate)
      }
    case AT.FETCH_INTEREST_TRANSACTIONS_FAILURE:
      return {
        ...state,
        interestTransactions: Remote.Failure(action.payload.error)
      }
    case AT.FETCH_INTEREST_TRANSACTIONS_LOADING:
      return {
        ...state,
        interestTransactions: Remote.Loading
      }
    case AT.FETCH_INTEREST_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        interestTransactions: Remote.Success(
          action.payload.interestTransactions
        )
      }
    case AT.INITIALIZE_DEPOSIT_FORM: {
      return {
        ...state,
        coin: action.payload.coin
      }
    }
    case AT.SET_INTEREST_STEP: {
      return {
        ...state,
        step: action.payload.step
      }
    }

    default:
      return state
  }
}
