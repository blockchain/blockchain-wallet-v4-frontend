import { RatesType } from '../misc/types'
import * as AT from './actionTypes'
import { CoinsActionTypes } from './types'

// RATES
export const fetchCoinsRates = () => ({
  type: AT.FETCH_COINS_RATES
})
export const fetchCoinsRatesLoading = (coin: string): CoinsActionTypes => ({
  payload: { coin },
  type: AT.FETCH_COINS_RATES_LOADING
})
export const fetchCoinsRatesSuccess = (coin: string, rates: RatesType): CoinsActionTypes => ({
  payload: { coin, rates },
  type: AT.FETCH_COINS_RATES_SUCCESS
})
export const fetchCoinsRatesFailure = (coin: string, error: string): CoinsActionTypes => ({
  payload: { coin, error },
  type: AT.FETCH_COINS_RATES_FAILURE
})

// FETCH_COINS_TRANSACTIONS
export const fetchTransactions = (coin: string, reset?) => ({
  payload: { coin, reset },
  type: AT.FETCH_COINS_TRANSACTIONS
})
export const fetchTransactionsFailure = (coin: string, error: string): CoinsActionTypes => ({
  payload: { coin, error },
  type: AT.FETCH_COINS_TRANSACTIONS_FAILURE
})
export const fetchTransactionsLoading = (coin: string, reset: boolean): CoinsActionTypes => ({
  payload: { coin, reset },
  type: AT.FETCH_COINS_TRANSACTIONS_LOADING
})
export const fetchTransactionsSuccess = (
  coin: string,
  transactions,
  reset: boolean,
  isFinalPage: boolean
): CoinsActionTypes => ({
  payload: { coin, isFinalPage, reset, transactions },
  type: AT.FETCH_COINS_TRANSACTIONS_SUCCESS
})
export const transactionsAtBound = (payload) => ({
  payload,
  type: AT.COINS_TRANSACTIONS_AT_BOUND
})
