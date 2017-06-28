import * as T from './actionTypes'

export const loadContextTxs = (payload) =>
  ({ type: T.CONTEXT_TXS_LOAD, payload })
export const requestTxs = (addressFilter, txPerPage) =>
  ({ type: T.TXS_LOAD_REQUEST, payload: {addressFilter, txPerPage} })
export const setAddressFilter = (addressFilter) =>
  ({ type: T.SET_ADDRESS_FILTER, payload: {addressFilter} })
export const setTypeFilter = (typeFilter) =>
  ({ type: T.SET_TYPE_FILTER, payload: {typeFilter} })
export const setSearchFilter = (searchFilter) =>
  ({ type: T.SET_SEARCH_FILTER, payload: {searchFilter} })
