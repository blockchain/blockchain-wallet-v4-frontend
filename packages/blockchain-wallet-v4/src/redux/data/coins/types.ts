import { IndexMultiResponseType, TickerResponseType } from 'core/network/api/coin/types'
import { RatesType, RemoteDataType } from 'core/types'

import * as AT from './actionTypes'

// state
export type CoinsState = {
  btcTicker: RemoteDataType<string, TickerResponseType>
  rates: RemoteDataType<string, RatesType>
  transactions: { [key in string]: Array<any> }
  transactions_at_bound: { [key in string]: boolean }
}

// actions
interface FetchCoinsRatesFailureActionType {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_COINS_RATES_FAILURE
}
interface FetchCoinsRatesLoadingActionType {
  type: typeof AT.FETCH_COINS_RATES_LOADING
}
interface FetchCoinsRatesSuccessActionType {
  payload: {
    rates: IndexMultiResponseType
  }
  type: typeof AT.FETCH_COINS_RATES_SUCCESS
}
interface FetchBtcTickerFailureActionType {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_BTC_TICKER_FAILURE
}
interface FetchBtcTickerLoadingActionType {
  type: typeof AT.FETCH_BTC_TICKER_LOADING
}
interface FetchBtcTickerSuccessActionType {
  payload: {
    rates: TickerResponseType
  }
  type: typeof AT.FETCH_BTC_TICKER_SUCCESS
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
  | FetchCoinsRatesFailureActionType
  | FetchCoinsRatesLoadingActionType
  | FetchCoinsRatesSuccessActionType
  | FetchBtcTickerFailureActionType
  | FetchBtcTickerLoadingActionType
  | FetchBtcTickerSuccessActionType
  | FetchTransactionsFailureActionType
  | FetchTransactionsLoadingActionType
  | FetchTransactionsSuccessActionType
  | SetTransactionsAtBoundActionType
