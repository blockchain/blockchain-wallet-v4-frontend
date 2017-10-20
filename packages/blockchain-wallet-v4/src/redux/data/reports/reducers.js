import * as T from './actionTypes.js'
import { assoc } from 'ramda'

const INITIAL_STATE = {
  transactions: []
}

const reportReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case T.SET_TRANSACTION_HISTORY: {
      const { data } = payload
      return assoc('transactions', data, state)
    }

    default:
      return state
  }
}

export default reportReducer
