import { assoc, merge, prop } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  bch_btc: Remote.NotAsked,
  bch_eth: Remote.NotAsked,
  btc_bch: Remote.NotAsked,
  btc_eth: Remote.NotAsked,
  eth_bch: Remote.NotAsked,
  eth_btc: Remote.NotAsked,
  order: Remote.NotAsked
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_SHAPESHIFT_ORDER_LOADING: {
      return assoc('order', Remote.Loading, state)
    }
    case AT.FETCH_SHAPESHIFT_ORDER_SUCCESS: {
      return assoc('order', Remote.Success(payload), state)
    }
    case AT.FETCH_SHAPESHIFT_ORDER_FAILURE: {
      return assoc('order', Remote.Failure(payload), state)
    }
    case AT.FETCH_SHAPESHIFT_PAIR_LOADING: {
      const { pair } = payload
      return assoc(pair, Remote.Loading, state)
    }
    case AT.FETCH_SHAPESHIFT_PAIR_SUCCESS: {
      const { pair, data } = payload
      const transformedData = prop('data', payload)
      return assoc(pair, Remote.Success(transformedData), state)
    }
    case AT.FETCH_SHAPESHIFT_PAIR_FAILURE: {
      const { pair, message } = payload
      return assoc(pair, Remote.Failure(payload), state)
    }
    default:
      return state
  }
}
