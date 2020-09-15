import { RatesType, RemoteDataType } from 'core/types'

import * as AT from './actionTypes'

// state
export type AlgoState = {
  rates: RemoteDataType<string, RatesType>
  transactions: Array<any>
  transactions_at_bound: boolean
}

// actions
interface FetchRatesFailureActionType {
  payload: string
  type: typeof AT.FETCH_ALGO_RATES_FAILURE
}
interface FetchRatesLoadingActionType {
  type: typeof AT.FETCH_ALGO_RATES_LOADING
}
interface FetchRatesSuccessActionType {
  payload: {
    rates: RatesType
  }
  type: typeof AT.FETCH_ALGO_RATES_SUCCESS
}
interface FetchTransactionsFailureActionType {
  payload: string
  type: typeof AT.FETCH_ALGO_TRANSACTIONS_FAILURE
}
interface FetchTransactionsLoadingActionType {
  payload: { reset: boolean }
  type: typeof AT.FETCH_ALGO_TRANSACTIONS_LOADING
}
interface FetchTransactionsSuccessActionType {
  payload: {
    isFinalPage: boolean
    reset: boolean
    transactions: AlgoState['transactions']
  }
  type: typeof AT.FETCH_ALGO_TRANSACTIONS_SUCCESS
}

export type AlgoActionTypes =
  | FetchRatesFailureActionType
  | FetchRatesLoadingActionType
  | FetchRatesSuccessActionType
  | FetchTransactionsFailureActionType
  | FetchTransactionsLoadingActionType
  | FetchTransactionsSuccessActionType
