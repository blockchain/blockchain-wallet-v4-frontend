import { assoc, assocPath } from 'ramda'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  btc_eth: {},
  eth_btc: {},
  order: {},
  trades: {}
}

const shapeShiftReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_BTC_ETH: {
      return assoc('btc_eth', payload, state)
    }
    case AT.SET_ETH_BTC: {
      return assoc('eth_btc', payload, state)
    }
    case AT.SET_ORDER: {
      return assoc('order', payload, state)
    }
    case AT.SET_TRADE_STATUS: {
      const { data } = payload
      const { address } = data
      return assocPath(['trades', address], data, state)
    }
    default:
      return state
  }
}

export default shapeShiftReducer
