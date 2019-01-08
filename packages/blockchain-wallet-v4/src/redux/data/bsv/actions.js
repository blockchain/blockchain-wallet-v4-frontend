import * as AT from './actionTypes'

export const setBSVLatestBlock = (block_index, hash, height, time) => ({
  type: AT.SET_BSV_LATEST_BLOCK,
  payload: { block_index, hash, height, time }
})

// FETCH_BSV_DATA
export const fetchData = () => ({ type: AT.FETCH_BSV_DATA })
export const fetchDataLoading = () => ({ type: AT.FETCH_BSV_DATA_LOADING })
export const fetchDataSuccess = data => ({
  type: AT.FETCH_BSV_DATA_SUCCESS,
  payload: data
})
export const fetchDataFailure = error => ({
  type: AT.FETCH_BSV_DATA_FAILURE,
  payload: error
})
export const resetData = () => ({ type: AT.RESET_BSV_DATA })

// FETCH_BSV_FEE
export const fetchFee = () => ({ type: AT.FETCH_BSV_FEE })
export const fetchFeeLoading = () => ({ type: AT.FETCH_BSV_FEE_LOADING })
export const fetchFeeSuccess = data => ({
  type: AT.FETCH_BSV_FEE_SUCCESS,
  payload: data
})
export const fetchFeeFailure = error => ({
  type: AT.FETCH_BSV_FEE_FAILURE,
  payload: error
})

// FETCH_BSV_RATES
export const fetchRates = () => ({ type: AT.FETCH_BSV_RATES })
export const fetchRatesLoading = () => ({ type: AT.FETCH_BSV_RATES_LOADING })
export const fetchRatesSuccess = data => ({
  type: AT.FETCH_BSV_RATES_SUCCESS,
  payload: data
})
export const fetchRatesFailure = error => ({
  type: AT.FETCH_BSV_RATES_FAILURE,
  payload: error
})

// FETCH_BSV_TRANSACTIONS
export const fetchTransactions = (address, reset) => ({
  type: AT.FETCH_BSV_TRANSACTIONS,
  payload: { address, reset }
})
export const fetchTransactionsLoading = reset => ({
  type: AT.FETCH_BSV_TRANSACTIONS_LOADING,
  payload: { reset }
})
export const fetchTransactionsSuccess = (transactions, reset) => ({
  type: AT.FETCH_BSV_TRANSACTIONS_SUCCESS,
  payload: { transactions, reset }
})
export const fetchTransactionsFailure = error => ({
  type: AT.FETCH_BSV_TRANSACTIONS_FAILURE,
  payload: error
})
export const transactionsAtBound = payload => ({
  type: AT.BSV_TRANSACTIONS_AT_BOUND,
  payload
})
