import { RatesType, RemoteDataType } from 'core/types'

import * as AT from './actionTypes'

// state
export type DogeState = {
  rates: RemoteDataType<string, RatesType>
  transactions: Array<any>
  transactions_at_bound: boolean
}

// actions
interface FetchRatesFailureActionType {
  payload: string
  type: typeof AT.FETCH_DOGE_RATES_FAILURE
}
interface FetchRatesLoadingActionType {
  type: typeof AT.FETCH_DOGE_RATES_LOADING
}
interface FetchRatesSuccessActionType {
  payload: {
    rates: RatesType
  }
  type: typeof AT.FETCH_DOGE_RATES_SUCCESS
}
interface FetchTransactionsFailureActionType {
  payload: string
  type: typeof AT.FETCH_DOGE_TRANSACTIONS_FAILURE
}
interface FetchTransactionsLoadingActionType {
  payload: { reset: boolean }
  type: typeof AT.FETCH_DOGE_TRANSACTIONS_LOADING
}
interface FetchTransactionsSuccessActionType {
  payload: {
    isFinalPage: boolean
    reset: boolean
    transactions: DogeState['transactions']
  }
  type: typeof AT.FETCH_DOGE_TRANSACTIONS_SUCCESS
}

export type DogeActionTypes =
  | FetchRatesFailureActionType
  | FetchRatesLoadingActionType
  | FetchRatesSuccessActionType
  | FetchTransactionsFailureActionType
  | FetchTransactionsLoadingActionType
  | FetchTransactionsSuccessActionType
