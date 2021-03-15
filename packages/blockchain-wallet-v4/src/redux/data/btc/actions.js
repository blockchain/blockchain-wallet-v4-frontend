import * as AT from './actionTypes'

export const setBtcLatestBlock = (block_index, hash, height, time) => ({
  type: AT.SET_BTC_LATEST_BLOCK,
  payload: { block_index, hash, height, time }
})

// FETCH_BTC_DATA
export const fetchData = () => ({ type: AT.FETCH_BTC_DATA })
export const fetchDataLoading = () => ({ type: AT.FETCH_BTC_DATA_LOADING })
export const fetchDataSuccess = data => ({
  type: AT.FETCH_BTC_DATA_SUCCESS,
  payload: data
})
export const fetchDataFailure = error => ({
  type: AT.FETCH_BTC_DATA_FAILURE,
  payload: error
})

// FETCH_BTC_FIAT_AT_TIME
export const fetchFiatAtTime = (hash, amount, time, currency) => ({
  type: AT.FETCH_BTC_FIAT_AT_TIME,
  payload: { hash, amount, time, currency }
})
export const fetchFiatAtTimeLoading = (hash, currency) => ({
  type: AT.FETCH_BTC_FIAT_AT_TIME_LOADING,
  payload: { hash, currency }
})
export const fetchFiatAtTimeSuccess = (hash, currency, data) => ({
  type: AT.FETCH_BTC_FIAT_AT_TIME_SUCCESS,
  payload: { hash, currency, data }
})
export const fetchFiatAtTimeFailure = (hash, currency, error) => ({
  type: AT.FETCH_BTC_FIAT_AT_TIME_FAILURE,
  payload: { hash, currency, error }
})

// FETCH_BTC_RATES
export const fetchRates = () => ({ type: AT.FETCH_BTC_RATES })
export const fetchRatesLoading = () => ({
  type: AT.FETCH_BTC_RATES_LOADING
})
export const fetchRatesSuccess = data => ({
  type: AT.FETCH_BTC_RATES_SUCCESS,
  payload: data
})
export const fetchRatesFailure = error => ({
  type: AT.FETCH_BTC_RATES_FAILURE,
  payload: error
})

// FETCH_BTC_TRANSACTIONS
export const fetchTransactions = (address, reset, filter) => ({
  type: AT.FETCH_BTC_TRANSACTIONS,
  payload: { address, reset, filter }
})
export const fetchTransactionsLoading = reset => ({
  type: AT.FETCH_BTC_TRANSACTIONS_LOADING,
  payload: { reset }
})
export const fetchTransactionsSuccess = (transactions, reset, isFinalPage) => ({
  type: AT.FETCH_BTC_TRANSACTIONS_SUCCESS,
  payload: { transactions, reset, isFinalPage }
})
export const fetchTransactionsFailure = error => ({
  type: AT.FETCH_BTC_TRANSACTIONS_FAILURE,
  payload: error
})
export const transactionsAtBound = payload => ({
  type: AT.BTC_TRANSACTIONS_AT_BOUND,
  payload
})

// FETCH_BTC_TRANSACTION_HISTORY
export const fetchTransactionHistory = (address, start, end) => ({
  type: AT.FETCH_BTC_TRANSACTION_HISTORY,
  payload: { address, start, end }
})
export const fetchTransactionHistoryLoading = () => ({
  type: AT.FETCH_BTC_TRANSACTION_HISTORY_LOADING
})
export const fetchTransactionHistorySuccess = data => ({
  type: AT.FETCH_BTC_TRANSACTION_HISTORY_SUCCESS,
  payload: data
})
export const fetchTransactionHistoryFailure = error => ({
  type: AT.FETCH_BTC_TRANSACTION_HISTORY_FAILURE,
  payload: error
})
export const clearTransactionHistory = () => ({
  type: AT.CLEAR_BTC_TRANSACTION_HISTORY
})
