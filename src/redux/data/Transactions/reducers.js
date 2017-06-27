import { combineReducers } from 'redux'

import * as A from './actions.js'

const list = (state = [], action) => {
  const { type } = action
  switch (type) {
    case A.CONTEXT_TXS_LOAD: {
      const { payload } = action
      return state.concat(payload.txs)
    }
    case A.SET_ADDRESS_FILTER: {
      return []
    }
    default:
      return state
  }
}

const addressFilter = (state = '', action) => {
  const { type } = action
  switch (type) {
    case A.SET_ADDRESS_FILTER: {
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
    case A.SET_TYPE_FILTER: {
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
    case A.SET_SEARCH_FILTER: {
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
