import { assoc } from 'ramda'
import * as RD from '../../remoteData'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  btc_eth: RD.NotAsked(),
  eth_btc: RD.NotAsked(),
  order: RD.NotAsked(),
  trades: RD.NotAsked()
}

const shapeShiftReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_BTC_ETH_LOADING: {
      return assoc('btc_eth', RD.Loading(), state)
    }
    case AT.FETCH_BTC_ETH_SUCCESS: {
      return assoc('btc_eth', RD.Success(payload), state)
    }
    case AT.FETCH_BTC_ETH_FAILURE: {
      return assoc('btc_eth', RD.Failed(payload), state)
    }
    case AT.FETCH_ETH_BTC_LOADING: {
      return assoc('eth_btc', RD.Loading(), state)
    }
    case AT.FETCH_ETH_BTC_SUCCESS: {
      return assoc('eth_btc', RD.Success(payload), state)
    }
    case AT.FETCH_ETH_BTC_FAILURE: {
      return assoc('eth_btc', RD.Failed(payload), state)
    }

    // case AT.SET_ORDER: {
    //   return assoc('order', payload, state)
    // }
    // case AT.SET_TRADE_STATUS: {
    //   const { data } = payload
    //   const { address } = data
    //   return assocPath(['trades', address], data, state)
    // }
    default:
      return state
  }
}

export default shapeShiftReducer
