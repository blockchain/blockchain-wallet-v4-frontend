import { assoc } from 'ramda'
import Remote from '../../../remote'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  bch_btc: Remote.NotAsked,
  bch_eth: Remote.NotAsked,
  btc_bch: Remote.NotAsked,
  btc_eth: Remote.NotAsked,
  eth_bch: Remote.NotAsked,
  eth_btc: Remote.NotAsked,
  order: Remote.NotAsked,
  quotation: Remote.NotAsked
}

const shapeShiftReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_BTC_ETH_LOADING: {
      return assoc('btc_eth', Remote.Loading, state)
    }
    case AT.FETCH_BTC_ETH_SUCCESS: {
      return assoc('btc_eth', Remote.Success(payload), state)
    }
    case AT.FETCH_BTC_ETH_FAILURE: {
      return assoc('btc_eth', Remote.Failure(payload), state)
    }
    case AT.FETCH_ETH_BTC_LOADING: {
      return assoc('eth_btc', Remote.Loading, state)
    }
    case AT.FETCH_ETH_BTC_SUCCESS: {
      return assoc('eth_btc', Remote.Success(payload), state)
    }
    case AT.FETCH_ETH_BTC_FAILURE: {
      return assoc('eth_btc', Remote.Failure(payload), state)
    }
    case AT.FETCH_PAIR_LOADING: {
      const { pair } = payload
      return assoc(pair, Remote.Loading, state)
    }
    case AT.FETCH_PAIR_SUCCESS: {
      const { pair, data } = payload
      return assoc(pair, Remote.Success(data), state)
    }
    case AT.FETCH_PAIR_FAILURE: {
      const { pair, error } = payload
      return assoc(pair, Remote.Failure(error), state)
    }
    case AT.FETCH_SHAPESHIFT_ORDER_LOADING: {
      return assoc('order', Remote.Loading, state)
    }
    case AT.FETCH_SHAPESHIFT_ORDER_SUCCESS: {
      return assoc('order', Remote.Success(payload), state)
    }
    case AT.FETCH_SHAPESHIFT_ORDER_FAILURE: {
      return assoc('order', Remote.Failure(payload), state)
    }
    case AT.FETCH_SHAPESHIFT_QUOTATION_LOADING: {
      return assoc('quotation', Remote.Loading, state)
    }
    case AT.FETCH_SHAPESHIFT_QUOTATION_SUCCESS: {
      return assoc('quotation', Remote.Success(payload), state)
    }
    case AT.FETCH_SHAPESHIFT_QUOTATION_FAILURE: {
      return assoc('quotation', Remote.Failure(payload), state)
    }
    default:
      return state
  }
}

export default shapeShiftReducer
