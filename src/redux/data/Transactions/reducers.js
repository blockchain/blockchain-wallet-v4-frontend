import { combineReducers } from 'redux'

import * as T from './actionTypes.js'

const list = (state = [], action) => {
  const { type } = action
  switch (type) {
    case T.FETCH_TRANSACTIONS_SUCCESS: {
      const { payload } = action
      return state.concat(payload.txs)
    }
    case T.SET_ADDRESS_FILTER: {
      return []
    }
    default:
      return state
  }
}

const addressFilter = (state = '', action) => {
  const { type } = action
  switch (type) {
    case T.SET_ADDRESS_FILTER: {
      const { payload } = action
      return payload.addressFilter
    }
    default:
      return state
  }
}

const typeFilter = (state = '', action) => {
  const { type } = action
  switch (type) {
    case T.SET_TYPE_FILTER: {
      const { payload } = action
      return payload.typeFilter
    }
    default:
      return state
  }
}

const searchFilter = (state = '', action) => {
  const { type } = action
  switch (type) {
    case T.SET_SEARCH_FILTER: {
      const { payload } = action
      return payload.searchFilter
    }
    default:
      return state
  }
}

const txsReducer = combineReducers({
  list,
  addressFilter,
  typeFilter,
  searchFilter
})

export default txsReducer
