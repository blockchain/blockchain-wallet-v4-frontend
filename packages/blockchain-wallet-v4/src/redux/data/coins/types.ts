import { RatesType, RemoteDataType } from 'core/types'

import * as AT from './actionTypes'

// state
export type CoinsState = {
  rates: { [key in string]: RemoteDataType<string, RatesType> }
  transactions: { [key in string]: Array<any> }
  transactions_at_bound: { [key in string]: boolean }
}

// actions
interface FetchCoinsFailureActionType {
  payload: {
    coin: string
    error: string
  }
  type: typeof AT.FETCH_COINS_RATES_FAILURE
}
interface FetchCoinsLoadingActionType {
  payload: {
    coin: string
  }
  type: typeof AT.FETCH_COINS_RATES_LOADING
}
interface FetchCoinsSuccessActionType {
  payload: {
    coin: string
    rates: RatesType
  }
  type: typeof AT.FETCH_COINS_RATES_SUCCESS
}
interface FetchTransactionsFailureActionType {
  payload: {
    coin: string
    error: string
  }
  type: typeof AT.FETCH_COINS_TRANSACTIONS_FAILURE
}
interface FetchTransactionsLoadingActionType {
  payload: { coin: string; reset: boolean }
  type: typeof AT.FETCH_COINS_TRANSACTIONS_LOADING
}
interface FetchTransactionsSuccessActionType {
  payload: {
    coin: string
    isFinalPage: boolean
    reset: boolean
    transactions: CoinsState['transactions']
  }
  type: typeof AT.FETCH_COINS_TRANSACTIONS_SUCCESS
}
interface SetTransactionsAtBoundActionType {
  payload: {
    atBounds: boolean
    coin: string
  }
  type: typeof AT.COINS_TRANSACTIONS_AT_BOUND
}

export type CoinsActionTypes =
  | FetchCoinsFailureActionType
  | FetchCoinsLoadingActionType
  | FetchCoinsSuccessActionType
  | FetchTransactionsFailureActionType
  | FetchTransactionsLoadingActionType
  | FetchTransactionsSuccessActionType
  | SetTransactionsAtBoundActionType
