import * as AT from './actionTypes'

export const setBtcLatestBlock = (block_index, hash, height, time) => ({
  payload: { block_index, hash, height, time },
  type: AT.SET_BTC_LATEST_BLOCK
})

// FETCH_BTC_DATA
export const fetchData = () => ({ type: AT.FETCH_BTC_DATA })
export const fetchDataLoading = () => ({ type: AT.FETCH_BTC_DATA_LOADING })
export const fetchDataSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_BTC_DATA_SUCCESS
})
export const fetchDataFailure = (error) => ({
  payload: error,
  type: AT.FETCH_BTC_DATA_FAILURE
})

// FETCH_BTC_FIAT_AT_TIME
export const fetchFiatAtTime = (hash, amount, time, currency) => ({
  payload: { amount, currency, hash, time },
  type: AT.FETCH_BTC_FIAT_AT_TIME
})
export const fetchFiatAtTimeLoading = (hash, currency) => ({
  payload: { currency, hash },
  type: AT.FETCH_BTC_FIAT_AT_TIME_LOADING
})
export const fetchFiatAtTimeSuccess = (hash, currency, data) => ({
  payload: { currency, data, hash },
  type: AT.FETCH_BTC_FIAT_AT_TIME_SUCCESS
})
export const fetchFiatAtTimeFailure = (hash, currency, error) => ({
  payload: { currency, error, hash },
  type: AT.FETCH_BTC_FIAT_AT_TIME_FAILURE
})

// FETCH_BTC_RATES
export const fetchRates = () => ({ type: AT.FETCH_BTC_RATES })
export const fetchRatesLoading = () => ({
  type: AT.FETCH_BTC_RATES_LOADING
})
export const fetchRatesSuccess = (data) => ({
  payload: data,
  type: AT.FETCH_BTC_RATES_SUCCESS
})
export const fetchRatesFailure = (error) => ({
  payload: error,
  type: AT.FETCH_BTC_RATES_FAILURE
})

// FETCH_BTC_TRANSACTIONS
export const fetchTransactions = (address, reset, filter) => ({
  payload: { address, filter, reset },
  type: AT.FETCH_BTC_TRANSACTIONS
})
export const fetchTransactionsLoading = (reset) => ({
  payload: { reset },
  type: AT.FETCH_BTC_TRANSACTIONS_LOADING
})
export const fetchTransactionsSuccess = (transactions, reset, isFinalPage) => ({
  payload: { isFinalPage, reset, transactions },
  type: AT.FETCH_BTC_TRANSACTIONS_SUCCESS
})
export const fetchTransactionsFailure = (error) => ({
  payload: error,
  type: AT.FETCH_BTC_TRANSACTIONS_FAILURE
})
export const transactionsAtBound = (payload) => ({
  payload,
  type: AT.BTC_TRANSACTIONS_AT_BOUND
})

// FETCH_BTC_TRANSACTION_HISTORY
export const fetchTransactionHistory = (address, start, end) => ({
  payload: { address, end, start },
  type: AT.FETCH_BTC_TRANSACTION_HISTORY
})
export const fetchTransactionHistoryLoading = () => ({
  type: AT.FETCH_BTC_TRANSACTION_HISTORY_LOADING
})
export const fetchTransactionHistorySuccess = (data) => ({
  payload: data,
  type: AT.FETCH_BTC_TRANSACTION_HISTORY_SUCCESS
})
export const fetchTransactionHistoryFailure = (error) => ({
  payload: error,
  type: AT.FETCH_BTC_TRANSACTION_HISTORY_FAILURE
})
export const clearTransactionHistory = () => ({
  type: AT.CLEAR_BTC_TRANSACTION_HISTORY
})
