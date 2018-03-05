import { assoc, assocPath, mergeAll, path } from 'ramda'
import Remote from '../../../remote'
import * as AT from './actionTypes'
import * as actionTypes from '../../actionTypes'

const INITIAL_STATE = {
  btc_eth: Remote.NotAsked,
  eth_btc: Remote.NotAsked,
  order: Remote.NotAsked,
  quotation: Remote.NotAsked,
  trades: {}
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
    case actionTypes.kvStore.shapeShift.FETCH_METADATA_SHAPESHIFT_SUCCESS: {
      const addresses = path(['value', 'trades'], payload).map(t => ({ [path(['quote', 'deposit'], t)]: Remote.NotAsked }))
      return assocPath(['trades'], mergeAll(addresses), state)
    }
    case AT.FETCH_TRADE_STATUS_LOADING: {
      const { address } = payload
      return assocPath(['trades', address], Remote.Loading, state)
    }
    case AT.FETCH_TRADE_STATUS_SUCCESS: {
      const { data, address } = payload
      return assocPath(['trades', address], Remote.Success(data), state)
    }
    case AT.FETCH_TRADE_STATUS_FAILURE: {
      const { error, address } = payload
      return assocPath(['trades', address], Remote.Failure(error), state)
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
