import * as AT from './actionTypes'

// RATES
export const fetchRates = () => ({ type: AT.FETCH_DOT_RATES })
export const fetchRatesLoading = () => ({
  type: AT.FETCH_DOT_RATES_LOADING
})
export const fetchRatesSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_DOT_RATES_SUCCESS
})
export const fetchRatesFailure = (error) => ({
  payload: error,
  type: AT.FETCH_DOT_RATES_FAILURE
})

// FETCH_DOT_TRANSACTIONS
export const fetchTransactions = (address?, reset?) => ({
  payload: { address, reset },
  type: AT.FETCH_DOT_TRANSACTIONS
})
export const fetchTransactionsFailure = (error) => ({
  payload: error,
  type: AT.FETCH_DOT_TRANSACTIONS_FAILURE
})
export const fetchTransactionsLoading = (reset) => ({
  payload: { reset },
  type: AT.FETCH_DOT_TRANSACTIONS_LOADING
})
export const fetchTransactionsSuccess = (transactions, reset, isFinalPage) => ({
  payload: { isFinalPage, reset, transactions },
  type: AT.FETCH_DOT_TRANSACTIONS_SUCCESS
})
export const transactionsAtBound = (payload) => ({
  payload,
  type: AT.DOT_TRANSACTIONS_AT_BOUND
})

// FETCH_BCH_TRANSACTION_HISTORY
export const fetchTransactionHistory = (address, start, end) => ({
  payload: { address, end, start },
  type: AT.FETCH_DOT_TRANSACTION_HISTORY
})
export const fetchTransactionHistoryLoading = () => ({
  type: AT.FETCH_DOT_TRANSACTION_HISTORY_LOADING
})
export const fetchTransactionHistorySuccess = (data) => ({
  payload: data,
  type: AT.FETCH_DOT_TRANSACTION_HISTORY_SUCCESS
})
export const fetchTransactionHistoryFailure = (error) => ({
  payload: error,
  type: AT.FETCH_DOT_TRANSACTION_HISTORY_FAILURE
})
export const clearTransactionHistory = () => ({
  type: AT.CLEAR_DOT_TRANSACTION_HISTORY
})
