import * as AT from './actionTypes'

// FETCH_ETH_DATA
export const fetchData = () => ({ type: AT.FETCH_ETH_DATA })
export const fetchDataLoading = () => ({
  type: AT.FETCH_ETH_DATA_LOADING
})
export const fetchDataSuccess = data => ({
  type: AT.FETCH_ETH_DATA_SUCCESS,
  payload: data
})
export const fetchDataFailure = error => ({
  type: AT.FETCH_ETH_DATA_FAILURE,
  payload: error
})

// FETCH_ETH_LATEST_BLOCK
export const fetchLatestBlock = () => ({
  type: AT.FETCH_ETH_LATEST_BLOCK
})
export const fetchLatestBlockLoading = () => ({
  type: AT.FETCH_ETH_LATEST_BLOCK_LOADING
})
export const fetchLatestBlockSuccess = data => ({
  type: AT.FETCH_ETH_LATEST_BLOCK_SUCCESS,
  payload: data
})
export const fetchLatestBlockFailure = error => ({
  type: AT.FETCH_ETH_LATEST_BLOCK_FAILURE,
  payload: error
})

// FETCH_ETH_BALANCE
export const fetchCurrentBalance = () => ({
  type: AT.FETCH_ETH_CURRENT_BALANCE
})
export const fetchCurrentBalanceLoading = () => ({
  type: AT.FETCH_ETH_CURRENT_BALANCE_LOADING
})
export const fetchCurrentBalanceSuccess = balance => ({
  type: AT.FETCH_ETH_CURRENT_BALANCE_SUCCESS,
  payload: { balance }
})
export const fetchCurrentBalanceFailure = error => ({
  type: AT.FETCH_ETH_CURRENT_BALANCE_FAILURE,
  payload: error
})

// FETCH_ETH_LEGACY_BALANCE
export const fetchLegacyBalance = () => ({
  type: AT.FETCH_ETH_LEGACY_BALANCE
})
export const fetchLegacyBalanceLoading = () => ({
  type: AT.FETCH_ETH_LEGACY_BALANCE_LOADING
})
export const fetchLegacyBalanceSuccess = balance => ({
  type: AT.FETCH_ETH_LEGACY_BALANCE_SUCCESS,
  payload: { balance }
})
export const fetchLegacyBalanceFailure = error => ({
  type: AT.FETCH_ETH_LEGACY_BALANCE_FAILURE,
  payload: error
})

// FETCH_ETH_RATES
export const fetchRates = () => ({ type: AT.FETCH_ETH_RATES })
export const fetchRatesLoading = () => ({
  type: AT.FETCH_ETH_RATES_LOADING
})
export const fetchRatesSuccess = data => ({
  type: AT.FETCH_ETH_RATES_SUCCESS,
  payload: data
})
export const fetchRatesFailure = error => ({
  type: AT.FETCH_ETH_RATES_FAILURE,
  payload: error
})

// FETCH_ETH_TRANSACTIONS
export const fetchTransactions = (address, reset) => ({
  type: AT.FETCH_ETH_TRANSACTIONS,
  payload: { address, reset }
})
export const fetchTransactionsLoading = (address, reset) => ({
  type: AT.FETCH_ETH_TRANSACTIONS_LOADING,
  payload: { address, reset }
})
export const fetchTransactionsSuccess = (transactions, reset) => ({
  type: AT.FETCH_ETH_TRANSACTIONS_SUCCESS,
  payload: { transactions, reset }
})
export const fetchTransactionsFailure = error => ({
  type: AT.FETCH_ETH_TRANSACTIONS_FAILURE,
  payload: error
})
export const transactionsAtBound = payload => ({
  type: AT.ETH_TRANSACTIONS_AT_BOUND,
  payload
})
