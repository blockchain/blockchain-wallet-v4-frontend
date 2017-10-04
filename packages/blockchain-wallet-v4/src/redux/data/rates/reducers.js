import * as T from './actionTypes.js'
import { assoc } from 'ramda'

const INITIAL_STATE = {
  bitcoin: {},
  ethereum: {}
}

const btcRatesReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case T.FETCH_BTC_RATES_SUCCESS: {
      return assoc('bitcoin', payload, state)
    }
    case T.FETCH_ETH_RATES_SUCCESS: {
      return assoc('ethereum', payload, state)
    }
    default:
      return state
  }
}

export default btcRatesReducer
