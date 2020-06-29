import * as AT from './actionTypes'

// RATES
export const fetchRates = () => ({ type: AT.FETCH_ALGO_RATES })
export const fetchRatesLoading = () => ({
  type: AT.FETCH_ALGO_RATES_LOADING
})
export const fetchRatesSuccess = data => ({
  type: AT.FETCH_ALGO_RATES_SUCCESS,
  payload: data
})
export const fetchRatesFailure = error => ({
  type: AT.FETCH_ALGO_RATES_FAILURE,
  payload: error
})

// FETCH_ALGO_TRANSACTIONS
export const fetchTransactions = (address?, reset?) => ({
  type: AT.FETCH_ALGO_TRANSACTIONS,
  payload: { address, reset }
})
export const fetchTransactionsFailure = error => ({
  type: AT.FETCH_ALGO_TRANSACTIONS_FAILURE,
  payload: error
})
export const fetchTransactionsLoading = reset => ({
  type: AT.FETCH_ALGO_TRANSACTIONS_LOADING,
  payload: { reset }
})
export const fetchTransactionsSuccess = (transactions, reset, isFinalPage) => ({
  type: AT.FETCH_ALGO_TRANSACTIONS_SUCCESS,
  payload: { transactions, reset, isFinalPage }
})
export const transactionsAtBound = payload => ({
  type: AT.ALGO_TRANSACTIONS_AT_BOUND,
  payload
})
