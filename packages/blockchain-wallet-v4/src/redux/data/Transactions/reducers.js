import * as T from './actionTypes.js'
import { assoc, equals, lensProp, over, concat } from 'ramda'

const INITIAL_STATE = {
  list: [],
  address: ''
}

const listReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case T.FETCH_TRANSACTIONS: {
      const { address } = payload
      if (!equals(address, state.address)) {
        return assoc('address', address, INITIAL_STATE)
      } else {
        return state
      }
    }

    case T.FETCH_TRANSACTIONS_SUCCESS: {
      const { payload } = action
      return over(lensProp('list'), concat(payload.txs), state)
    }

    case T.DELETE_TRANSACTIONS: {
      return []
    }
    default:
      return state
  }
}

export default listReducer
