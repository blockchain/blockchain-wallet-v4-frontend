import * as AT from './actionTypes'

export const setBCHLatestBlock = (block_index, hash, height, time) => ({
  type: AT.SET_BCH_LATEST_BLOCK,
  payload: { block_index, hash, height, time }
})

// FETCH_BCH_DATA
export const fetchData = () => ({ type: AT.FETCH_BCH_DATA })
export const fetchDataLoading = () => ({ type: AT.FETCH_BCH_DATA_LOADING })
export const fetchDataSuccess = data => ({
  type: AT.FETCH_BCH_DATA_SUCCESS,
  payload: data
})
export const fetchDataFailure = error => ({
  type: AT.FETCH_BCH_DATA_FAILURE,
  payload: error
})

// FETCH_BCH_RATES
export const fetchRates = () => ({ type: AT.FETCH_BCH_RATES })
export const fetchRatesLoading = () => ({ type: AT.FETCH_BCH_RATES_LOADING })
export const fetchRatesSuccess = data => ({
  type: AT.FETCH_BCH_RATES_SUCCESS,
  payload: data
})
export const fetchRatesFailure = error => ({
  type: AT.FETCH_BCH_RATES_FAILURE,
  payload: error
})

// FETCH_BCH_TRANSACTIONS
export const fetchTransactions = (address, reset, filter) => ({
  type: AT.FETCH_BCH_TRANSACTIONS,
  payload: { address, reset, filter }
})
export const fetchTransactionsLoading = reset => ({
  type: AT.FETCH_BCH_TRANSACTIONS_LOADING,
  payload: { reset }
})
export const fetchTransactionsSuccess = (transactions, reset) => ({
  type: AT.FETCH_BCH_TRANSACTIONS_SUCCESS,
  payload: { transactions, reset }
})
export const fetchTransactionsFailure = error => ({
  type: AT.FETCH_BCH_TRANSACTIONS_FAILURE,
  payload: error
})
export const transactionsAtBound = payload => ({
  type: AT.BCH_TRANSACTIONS_AT_BOUND,
  payload
})

// FETCH_BCH_TRANSACTION_HISTORY
export const fetchTransactionHistory = (address, start, end) => ({
  type: AT.FETCH_BCH_TRANSACTION_HISTORY,
  payload: { address, start, end }
})
export const fetchTransactionHistoryLoading = () => ({
  type: AT.FETCH_BCH_TRANSACTION_HISTORY_LOADING
})
export const fetchTransactionHistorySuccess = data => ({
  type: AT.FETCH_BCH_TRANSACTION_HISTORY_SUCCESS,
  payload: data
})
export const fetchTransactionHistoryFailure = error => ({
  type: AT.FETCH_BCH_TRANSACTION_HISTORY_FAILURE,
  payload: error
})
export const clearTransactionHistory = () => ({
  type: AT.CLEAR_BCH_TRANSACTION_HISTORY
})
