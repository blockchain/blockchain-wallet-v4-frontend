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
export const setLedgerDetailsSuccess = (ledger) => ({
  payload: { ledger },
  type: AT.SET_LEDGER_DETAILS_SUCCESS
})
export const setLedgerDetailsFailure = (e) => ({
  payload: { e },
  type: AT.SET_LEDGER_DETAILS_FAILURE
})

// ACCOUNT DATA
export const fetchData = () => ({ type: AT.FETCH_DATA })
export const fetchAccountSuccess = (id, account) => ({
  payload: { account, id },
  type: AT.FETCH_ACCOUNT_SUCCESS
})
export const fetchAccountFailure = (id, error) => ({
  payload: { error, id },
  type: AT.FETCH_ACCOUNT_FAILURE
})
export const fetchAccountLoading = (id) => ({
  payload: { id },
  type: AT.FETCH_ACCOUNT_LOADING
})
export const fetchDataSuccess = (accounts) => ({
  payload: { accounts },
  type: AT.FETCH_DATA_SUCCESS
})

// TRANSACTIONS
export const fetchTransactions = (accountId, reset) => ({
  payload: { accountId, reset },
  type: AT.FETCH_TRANSACTIONS
})
export const fetchTransactionsLoading = (reset) => ({
  payload: { reset },
  type: AT.FETCH_TRANSACTIONS_LOADING
})
export const fetchTransactionsSuccess = (txs, reset) => ({
  payload: { reset, txs },
  type: AT.FETCH_TRANSACTIONS_SUCCESS
})
export const fetchTransactionsFailure = (error) => ({
  payload: { error },
  type: AT.FETCH_TRANSACTIONS_FAILURE
})
export const transactionsAtBound = (atBound) => ({
  payload: { atBound },
  type: AT.TRANSACTIONS_AT_BOUND
})
export const addNewTransactions = (txs) => ({
  payload: { txs },
  type: AT.ADD_NEW_TRANSACTIONS
})

// TRANSACTION HISTORY
export const fetchTransactionHistory = (address, start, end) => ({
  payload: { address, end, start },
  type: AT.FETCH_TRANSACTION_HISTORY
})
export const fetchTransactionHistoryLoading = () => ({
  type: AT.FETCH_TRANSACTION_HISTORY_LOADING
})
export const fetchTransactionHistorySuccess = (data) => ({
  payload: data,
  type: AT.FETCH_TRANSACTION_HISTORY_SUCCESS
})
export const fetchTransactionHistoryFailure = (error) => ({
  payload: error,
  type: AT.FETCH_TRANSACTION_HISTORY_FAILURE
})
export const clearTransactionHistory = () => ({
  type: AT.CLEAR_TRANSACTION_HISTORY
})
