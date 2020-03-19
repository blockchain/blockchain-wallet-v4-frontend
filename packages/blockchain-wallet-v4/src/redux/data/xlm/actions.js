import * as AT from './actionTypes'

// UTILS
export const createTestAccounts = () => ({
  type: AT.CREATE_TEST_ACCOUNTS
})

// LEDGER DETAILS
export const fetchLedgerDetails = () => ({ type: AT.FETCH_LEDGER_DETAILS })
export const setLedgerDetailsLoading = () => ({
  type: AT.SET_LEDGER_DETAILS_LOADING
})
export const setLedgerDetailsSuccess = ledger => ({
  type: AT.SET_LEDGER_DETAILS_SUCCESS,
  payload: { ledger }
})
export const setLedgerDetailsFailure = e => ({
  type: AT.SET_LEDGER_DETAILS_FAILURE,
  payload: { e }
})

// ACCOUNT DATA
export const fetchData = () => ({ type: AT.FETCH_DATA })
export const fetchAccountSuccess = (id, account) => ({
  type: AT.FETCH_ACCOUNT_SUCCESS,
  payload: { id, account }
})
export const fetchAccountFailure = (id, error) => ({
  type: AT.FETCH_ACCOUNT_FAILURE,
  payload: { id, error }
})
export const fetchAccountLoading = id => ({
  type: AT.FETCH_ACCOUNT_LOADING,
  payload: { id }
})
export const fetchDataSuccess = accounts => ({
  type: AT.FETCH_DATA_SUCCESS,
  payload: { accounts }
})

// RATES
export const fetchRates = () => ({ type: AT.FETCH_RATES })
export const setRatesLoading = () => ({ type: AT.SET_RATES_LOADING })
export const setRatesSuccess = rates => ({
  type: AT.SET_RATES_SUCCESS,
  payload: { rates }
})
export const setRatesFailure = e => ({
  type: AT.SET_RATES_FAILURE,
  payload: { e }
})

// TRANSACTIONS
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
export const addNewTransactions = txs => ({
  type: AT.ADD_NEW_TRANSACTIONS,
  payload: { txs }
})

// TRANSACTION HISTORY
export const fetchTransactionHistory = (address, start, end) => ({
  type: AT.FETCH_TRANSACTION_HISTORY,
  payload: { address, start, end }
})
export const fetchTransactionHistoryLoading = () => ({
  type: AT.FETCH_TRANSACTION_HISTORY_LOADING
})
export const fetchTransactionHistorySuccess = data => ({
  type: AT.FETCH_TRANSACTION_HISTORY_SUCCESS,
  payload: data
})
export const fetchTransactionHistoryFailure = error => ({
  type: AT.FETCH_TRANSACTION_HISTORY_FAILURE,
  payload: error
})
export const clearTransactionHistory = () => ({
  type: AT.CLEAR_TRANSACTION_HISTORY
})
