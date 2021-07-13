import Remote from '../../../remote'
import * as AT from './actionTypes'
import { DotActionTypes, DotState } from './types'

const INITIAL_STATE: DotState = {
  rates: Remote.NotAsked,
  transaction_history: Remote.NotAsked,
  transactions: [],
  transactions_at_bound: false
}

export const dotReducer = (state = INITIAL_STATE, action: DotActionTypes): DotState => {
  switch (action.type) {
    case AT.FETCH_DOT_RATES_FAILURE:
      return {
        ...state,
        rates: Remote.Failure(action.payload)
      }
    case AT.FETCH_DOT_RATES_LOADING:
      return {
        ...state,
        rates: Remote.Loading
      }
    case AT.FETCH_DOT_RATES_SUCCESS:
      return {
        ...state,
        rates: Remote.Success(action.payload)
      }
    case AT.FETCH_DOT_TRANSACTIONS_FAILURE:
      return {
        ...state,
        transactions: [Remote.Failure(action.payload)]
      }
    case AT.FETCH_DOT_TRANSACTIONS_LOADING:
      const { reset } = action.payload
      return {
        ...state,
        transactions: reset ? [Remote.Loading] : [...state.transactions, Remote.Loading]
      }
    case AT.FETCH_DOT_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactions: [
          ...state.transactions.filter((tx, i) => i !== state.transactions.length - 1),
          Remote.Success(action.payload.transactions)
        ]
      }
    case AT.FETCH_DOT_TRANSACTION_HISTORY_LOADING: {
      return {
        ...state,
        transaction_history: Remote.Loading
      }
    }
    case AT.FETCH_DOT_TRANSACTION_HISTORY_SUCCESS: {
      return {
        ...state,
        transaction_history: Remote.Success(action.payload.transaction_history)
      }
    }
    case AT.FETCH_DOT_TRANSACTION_HISTORY_FAILURE: {
      return {
        ...state,
        transaction_history: Remote.Failure(action.payload.error)
      }
    }
    case AT.CLEAR_DOT_TRANSACTION_HISTORY: {
      return {
        ...state,
        transaction_history: Remote.NotAsked
      }
    }
    default: {
      return state
    }
  }
}

export default dotReducer
