import * as AT from './actionTypes'

// FETCH_BTC_TRANSACTIONS
export const fetchBtcTransactions = (address, reset) => ({
  type: AT.FETCH_BTC_TRANSACTIONS,
  payload: { address, reset }
})
export const fetchBtcTransactionsLoading = reset => ({
  type: AT.FETCH_BTC_TRANSACTIONS_LOADING,
  payload: { reset }
})
export const fetchBtcTransactionsSuccess = (transactions, reset) => ({
  type: AT.FETCH_BTC_TRANSACTIONS_SUCCESS,
  payload: { transactions, reset }
})
export const fetchBtcTransactionsFailure = error => ({
  type: AT.FETCH_BTC_TRANSACTIONS_FAILURE,
  payload: error
})
