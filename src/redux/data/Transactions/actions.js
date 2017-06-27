
export const CONTEXT_TXS_LOAD = '@v3.CONTEXT_TXS_LOAD'
export const TXS_LOAD_REQUEST = '@v3.TXS_LOAD_REQUEST'
export const CONTEXT_TXS_CLEAR = '@v3.CONTEXT_TXS_CLEAR'
export const SET_ADDRESS_FILTER = '@v3.SET_ADDRESS_FILTER'
export const SET_TYPE_FILTER = '@v3.SET_TYPE_FILTER'
export const SET_SEARCH_FILTER = '@v3.SET_SEARCH_FILTER'

export const loadContextTxs = (payload) =>
  ({ type: CONTEXT_TXS_LOAD, payload })
export const requestTxs = (addressFilter, txPerPage) =>
  ({ type: TXS_LOAD_REQUEST, payload: {addressFilter, txPerPage} })
export const setAddressFilter = (addressFilter) =>
  ({ type: SET_ADDRESS_FILTER, payload: {addressFilter} })
export const setTypeFilter = (typeFilter) =>
  ({ type: SET_TYPE_FILTER, payload: {typeFilter} })
export const setSearchFilter = (searchFilter) =>
  ({ type: SET_SEARCH_FILTER, payload: {searchFilter} })
