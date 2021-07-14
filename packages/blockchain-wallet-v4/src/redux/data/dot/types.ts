import { RatesType, RemoteDataType } from 'core/types'

import * as AT from './actionTypes'

// state
export type DotState = {
  rates: RemoteDataType<string, RatesType>
  transaction_history: RemoteDataType<string, any>
  transactions: Array<any>
  transactions_at_bound: boolean
}

// actions
interface FetchRatesFailureActionType {
  payload: string
  type: typeof AT.FETCH_DOT_RATES_FAILURE
}
interface FetchRatesLoadingActionType {
  type: typeof AT.FETCH_DOT_RATES_LOADING
}
interface FetchRatesSuccessActionType {
  payload: {
    rates: RatesType
  }
  type: typeof AT.FETCH_DOT_RATES_SUCCESS
}
interface FetchTransactionsFailureActionType {
  payload: string
  type: typeof AT.FETCH_DOT_TRANSACTIONS_FAILURE
}
interface FetchTransactionsLoadingActionType {
  payload: { reset: boolean }
  type: typeof AT.FETCH_DOT_TRANSACTIONS_LOADING
}
interface FetchTransactionsSuccessActionType {
  payload: {
    isFinalPage: boolean
    reset: boolean
    transactions: DotState['transactions']
  }
  type: typeof AT.FETCH_DOT_TRANSACTIONS_SUCCESS
}
interface FetchTransactionsHistoryLoadingType {
  type: typeof AT.FETCH_DOT_TRANSACTION_HISTORY_LOADING
}
interface ClearTransactionsHistoryLoadingType {
  type: typeof AT.CLEAR_DOT_TRANSACTION_HISTORY
}

interface FetchTransactionsHistorySuccessType {
  payload: { transaction_history: any }
  type: typeof AT.FETCH_DOT_TRANSACTION_HISTORY_SUCCESS
}
interface FetchTransactionsHistoryFailureType {
  payload: { error: string }
  type: typeof AT.FETCH_DOT_TRANSACTION_HISTORY_FAILURE
}

export type DotActionTypes =
  | FetchRatesFailureActionType
  | FetchRatesLoadingActionType
  | FetchRatesSuccessActionType
  | FetchTransactionsFailureActionType
  | FetchTransactionsLoadingActionType
  | FetchTransactionsSuccessActionType
  | FetchTransactionsHistoryLoadingType
  | FetchTransactionsHistoryFailureType
  | FetchTransactionsHistorySuccessType
  | ClearTransactionsHistoryLoadingType
