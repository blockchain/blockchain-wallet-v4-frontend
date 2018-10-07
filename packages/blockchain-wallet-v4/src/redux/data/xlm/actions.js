import * as AT from './actionTypes'

// FETCH_XLM_DATA
export const fetchData = () => ({ type: AT.FETCH_XLM_DATA })
export const fetchDataLoading = () => ({
  type: AT.FETCH_XLM_DATA_LOADING
})
export const fetchDataSuccess = data => ({
  type: AT.FETCH_XLM_DATA_SUCCESS,
  payload: data
})
export const fetchDataFailure = error => ({
  type: AT.FETCH_XLM_DATA_FAILURE,
  payload: error
})

// FETCH_XLM_BALANCE
export const fetchBalance = () => ({
  type: AT.FETCH_XLM_CURRENT_BALANCE
})
export const fetchBalanceLoading = () => ({
  type: AT.FETCH_XLM_CURRENT_BALANCE_LOADING
})
export const fetchBalanceSuccess = balance => ({
  type: AT.FETCH_XLM_CURRENT_BALANCE_SUCCESS,
  payload: { balance }
})
export const fetchBalanceFailure = error => ({
  type: AT.FETCH_XLM_CURRENT_BALANCE_FAILURE,
  payload: error
})

// FETCH_XLM_RATES
export const fetchRates = () => ({ type: AT.FETCH_XLM_RATES })
export const fetchRatesLoading = () => ({
  type: AT.FETCH_XLM_RATES_LOADING
})
export const fetchRatesSuccess = data => ({
  type: AT.FETCH_XLM_RATES_SUCCESS,
  payload: data
})
export const fetchRatesFailure = error => ({
  type: AT.FETCH_XLM_RATES_FAILURE,
  payload: error
})

// FETCH_XLM_TRANSACTIONS
export const fetchTransactions = (address, reset) => ({
  type: AT.FETCH_XLM_TRANSACTIONS,
  payload: { address, reset }
})
export const fetchTransactionsLoading = (address, reset) => ({
  type: AT.FETCH_XLM_TRANSACTIONS_LOADING,
  payload: { address, reset }
})
export const fetchTransactionsSuccess = (transactions, reset) => ({
  type: AT.FETCH_XLM_TRANSACTIONS_SUCCESS,
  payload: { transactions, reset }
})
export const fetchTransactionsFailure = error => ({
  type: AT.FETCH_XLM_TRANSACTIONS_FAILURE,
  payload: error
})
