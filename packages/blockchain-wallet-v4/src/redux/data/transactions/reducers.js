import * as T from './actionTypes.js'
import { concat } from 'ramda'

const INITIAL_STATE = {
  list: [],
  address: ''
}

const listReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case T.SET_TRANSACTIONS: {
      const { address, txs, reset } = payload
      if (reset) {
        return { address, list: txs }
      } else {
        return { address, list: concat(txs, state.list) }
      }
    }

    default:
      return state
  }
}

export default listReducer
