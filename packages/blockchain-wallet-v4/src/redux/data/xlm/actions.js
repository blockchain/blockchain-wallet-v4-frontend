import * as AT from './actionTypes'

export const fetchLedgerDetails = () => ({ type: AT.FETCH_LEDGER_DETAILS })
export const setLedgerDetails = ledger => ({
  type: AT.SET_LEDGER_DETAILS,
  payload: { ledger }
})

export const fetchData = () => ({ type: AT.FETCH_DATA })
export const fetchDataSuccess = data => ({
  type: AT.FETCH_DATA_SUCCESS,
  payload: { data }
})
export const fetchDataFailure = error => ({
  type: AT.FETCH_DATA_FAILURE,
  payload: { error }
})
export const fetchDataLoading = () => ({
  type: AT.FETCH_DATA_LOADING
})

export const fetchRates = () => ({ type: AT.FETCH_RATES })
export const setRates = rates => ({
  type: AT.SET_RATES,
  payload: { rates }
})

export const fetchTransactions = (accountId, reset) => ({
  type: AT.FETCH_TRANSACTIONS,
  payload: { accountId, reset }
})
export const fetchTransactionsLoading = reset => ({
  type: AT.FETCH_TRANSACTIONS_LOADING,
  payload: { reset }
})
export const fetchTransactionsSuccess = (txs, reset) => ({
  type: AT.FETCH_TRANSACTIONS_SUCCESS,
  payload: { txs, reset }
})
export const fetchTransactionsFailure = error => ({
  type: AT.FETCH_TRANSACTIONS_FAILURE,
  payload: { error }
})
export const transactionsAtBound = atBound => ({
  type: AT.TRANSACTIONS_AT_BOUND,
  payload: { atBound }
})
