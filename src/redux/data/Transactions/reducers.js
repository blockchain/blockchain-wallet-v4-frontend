import { combineReducers } from 'redux'

import * as A from './actions.js'

const list = (state = [], action) => {
  const { type } = action
  switch (type) {
    case A.CONTEXT_TXS_LOAD: {
      const { payload } = action
      return state.concat(payload.txs)
    }
    case A.SET_ONLY_SHOW: {
      return []
    }
    default:
      return state
  }
}

const onlyShow = (state = '', action) => {
  const { type } = action
  switch (type) {
    case A.SET_ONLY_SHOW: {
      const { payload } = action
      return payload.onlyShow
    }
    default:
      return state
  }
}

const txsReducer = combineReducers({
  list,
  onlyShow
})

export default txsReducer
