import * as AT from './actionTypes'

// FETCH_ALGO_TRANSACTIONS
export const fetchTransactions = (address, reset) => ({
  type: AT.FETCH_ALGO_TRANSACTIONS,
  payload: { address, reset }
})
export const fetchTransactionsLoading = reset => ({
  type: AT.FETCH_ALGO_TRANSACTIONS_LOADING,
  payload: { reset }
})
export const fetchTransactionsSuccess = (transactions, reset, isFinalPage) => ({
  type: AT.FETCH_ALGO_TRANSACTIONS_SUCCESS,
  payload: { transactions, reset, isFinalPage }
})
export const fetchTransactionsFailure = error => ({
  type: AT.FETCH_ALGO_TRANSACTIONS_FAILURE,
  payload: error
})
export const transactionsAtBound = payload => ({
  type: AT.ALGO_TRANSACTIONS_AT_BOUND,
  payload
})
