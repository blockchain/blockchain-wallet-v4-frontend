import * as AT from './actionTypes'

export const setBCHLatestBlock = (block_index, hash, height, time) => ({
  payload: { block_index, hash, height, time },
  type: AT.SET_BCH_LATEST_BLOCK
})

// FETCH_BCH_DATA
export const fetchData = () => ({ type: AT.FETCH_BCH_DATA })
export const fetchDataLoading = () => ({ type: AT.FETCH_BCH_DATA_LOADING })
export const fetchDataSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_BCH_DATA_SUCCESS
})
export const fetchDataFailure = (error) => ({
  payload: error,
  type: AT.FETCH_BCH_DATA_FAILURE
})

// FETCH_BCH_TRANSACTIONS
export const fetchTransactions = (address, reset, filter) => ({
  payload: { address, filter, reset },
  type: AT.FETCH_BCH_TRANSACTIONS
})
export const fetchTransactionsLoading = (reset) => ({
  payload: { reset },
  type: AT.FETCH_BCH_TRANSACTIONS_LOADING
})
export const fetchTransactionsSuccess = (transactions, reset) => ({
  payload: { reset, transactions },
  type: AT.FETCH_BCH_TRANSACTIONS_SUCCESS
})
export const fetchTransactionsFailure = (error) => ({
  payload: error,
  type: AT.FETCH_BCH_TRANSACTIONS_FAILURE
})
export const transactionsAtBound = (payload) => ({
  payload,
  type: AT.BCH_TRANSACTIONS_AT_BOUND
})

// FETCH_BCH_TRANSACTION_HISTORY
export const fetchTransactionHistory = (address, start, end) => ({
  payload: { address, end, start },
  type: AT.FETCH_BCH_TRANSACTION_HISTORY
})
export const fetchTransactionHistoryLoading = () => ({
  type: AT.FETCH_BCH_TRANSACTION_HISTORY_LOADING
})
export const fetchTransactionHistorySuccess = (data) => ({
  payload: data,
  type: AT.FETCH_BCH_TRANSACTION_HISTORY_SUCCESS
})
export const fetchTransactionHistoryFailure = (error) => ({
  payload: error,
  type: AT.FETCH_BCH_TRANSACTION_HISTORY_FAILURE
})
export const clearTransactionHistory = () => ({
  type: AT.CLEAR_BCH_TRANSACTION_HISTORY
})
