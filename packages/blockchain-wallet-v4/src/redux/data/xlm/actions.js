import * as AT from './actionTypes'

export const fetchLedgerDetails = () => ({ type: AT.FETCH_LEDGER_DETAILS })
export const setLedgerDetails = ledger => ({
  type: AT.SET_LEDGER_DETAILS,
  payload: { ledger }
})

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

export const createTestAccounts = () => ({
  type: AT.CREATE_TEST_ACCOUNTS
})

export const addNewTransactions = txs => ({
  type: AT.ADD_NEW_TRANSACTIONS,
  payload: { txs }
})
