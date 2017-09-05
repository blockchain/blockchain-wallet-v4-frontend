import * as T from './actionTypes'

export const fetchTransactions = (address, txPerPage) => ({ type: T.FETCH_TRANSACTIONS, payload: {address, txPerPage} })
export const fetchTransactionsSuccess = (payload) => ({ type: T.FETCH_TRANSACTIONS_SUCCESS, payload })
export const fetchTransactionsError = (errorKey) => ({ type: T.FETCH_TRANSACTIONS_ERROR, payload: errorKey, error: true })

export const deleteTransactions = () => ({ type: T.DELETE_TRANSACTIONS })
