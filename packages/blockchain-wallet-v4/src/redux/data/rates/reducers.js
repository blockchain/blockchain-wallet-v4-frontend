import * as T from './actionTypes.js'
import { assoc } from 'ramda'

const INITIAL_STATE = {
  bitcoin: {},
  ethereum: {}
}

const ratesReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case T.SET_BITCOIN_RATES: {
      return assoc('bitcoin', payload, state)
    }
    case T.SET_ETHEREUM_RATES: {
      return assoc('ethereum', payload, state)
    }
    default:
      return state
  }
}

export default ratesReducer
