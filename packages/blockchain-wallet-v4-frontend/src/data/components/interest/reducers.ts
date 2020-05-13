import * as AT from './actionTypes'
import { InterestActionTypes, InterestState } from './types'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

const INITIAL_STATE: InterestState = {
  account: Remote.NotAsked,
  accountBalance: Remote.NotAsked,
  coin: 'BTC',
  depositLimits: {
    maxFiat: 0,
    minFiat: 0
  },
  interestEligible: Remote.NotAsked,
  instruments: Remote.NotAsked,
  interestLimits: Remote.NotAsked,
  interestRate: Remote.NotAsked,
  payment: Remote.NotAsked,
  step: {
    data: {},
    name: 'ACCOUNT_SUMMARY'
  },
  transactions: Remote.NotAsked
}

export function interestReducer (
  state = INITIAL_STATE,
  action: InterestActionTypes
): InterestState {
  switch (action.type) {
    case AT.FETCH_INTEREST_BALANCE_FAILURE:
      return {
        ...state,
        accountBalance: Remote.Failure(action.payload.error)
      }
    case AT.FETCH_INTEREST_BALANCE_LOADING:
      return {
        ...state,
        accountBalance: Remote.Loading
      }
    case AT.FETCH_INTEREST_BALANCE_SUCCESS:
      return {
        ...state,
        accountBalance: Remote.Success(action.payload.interestAccountBalance)
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
        instruments: Remote.Failure(action.payload.error)
      }
    case AT.FETCH_INTEREST_INSTRUMENTS_LOADING:
      return {
        ...state,
        instruments: Remote.Loading
      }
    case AT.FETCH_INTEREST_INSTRUMENTS_SUCCESS:
      return {
        ...state,
        instruments: Remote.Success(action.payload.interestInstruments)
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
        interestRate: Remote.Success(action.payload.interestRate.rates)
      }
    case AT.FETCH_INTEREST_TRANSACTIONS_FAILURE:
      return {
        ...state,
        transactions: Remote.Failure(action.payload.error)
      }
    case AT.FETCH_INTEREST_TRANSACTIONS_LOADING:
      return {
        ...state,
        transactions: Remote.Loading
      }
    case AT.FETCH_INTEREST_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactions: Remote.Success(action.payload.interestTransactions)
      }
    case AT.INITIALIZE_DEPOSIT_FORM: {
      return {
        ...state,
        coin: action.payload.coin
      }
    }
    case AT.SET_INTEREST_DEPOSIT_LIMITS: {
      return {
        ...state,
        depositLimits: action.payload.limits
      }
    }
    case AT.SET_INTEREST_STEP: {
      const { data, name } = action.payload
      return {
        ...state,
        step: {
          data: data || {},
          name
        }
      }
    }
    case AT.SET_PAYMENT_FAILURE:
      return {
        ...state,
        payment: Remote.Failure(action.payload.error)
      }
    case AT.SET_PAYMENT_LOADING:
      return {
        ...state,
        payment: Remote.Loading
      }
    case AT.SET_PAYMENT_SUCCESS:
      return {
        ...state,
        payment: Remote.Success(action.payload.payment)
      }

    default:
      return state
  }
}
