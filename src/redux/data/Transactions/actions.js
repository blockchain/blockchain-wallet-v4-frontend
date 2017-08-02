import * as T from './actionTypes'

export const fetchTransactions = (addressFilter, txPerPage) =>
  ({ type: T.FETCH_TRANSACTIONS, payload: {addressFilter, txPerPage} })
export const fetchTransactionsSuccess = (payload) =>
  ({ type: T.FETCH_TRANSACTIONS_SUCCESS, payload })
export const fetchTransactionsError = (errorKey) =>
  ({ type: T.FETCH_TRANSACTIONS_ERROR, payload: errorKey, error: true })

export const setAddressFilter = (addressFilter) =>
  ({ type: T.SET_ADDRESS_FILTER, payload: {addressFilter} })
export const setTypeFilter = (typeFilter) =>
  ({ type: T.SET_TYPE_FILTER, payload: {typeFilter} })
export const setSearchFilter = (searchFilter) =>
  ({ type: T.SET_SEARCH_FILTER, payload: {searchFilter} })

  export const deleteTransactions = () =>
  ({ type: T.DELETE_TRANSACTIONS })
