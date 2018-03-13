import { over, mapped, pipe } from 'ramda-lens'
import { append, compose } from 'ramda'
import { KVStoreEntry } from '../../../types'
import * as AT from './actionTypes'
import Remote from '../../../remote'
import { lensProp } from '../../../types/util'

// initial state should be a kvstore object
const INITIAL_STATE = Remote.NotAsked

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_METADATA_SHAPESHIFT_LOADING: {
      return Remote.Loading
    }
    case AT.CREATE_METADATA_SHAPESHIFT:
    case AT.FETCH_METADATA_SHAPESHIFT_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.FETCH_METADATA_SHAPESHIFT_FAILURE: {
      return Remote.Failure(payload)
    }
    case AT.ADD_TRADE_METADATA_SHAPESHIFT: {
      const { trade } = payload
      return over(compose(mapped, lensProp('value'), lensProp('trades')), append(trade), state)
    }
    case AT.UPDATE_TRADE_METADATA_SHAPESHIFT: {
      const { orderId, trade } = payload
      console.log(orderId, trade)
      // return set(compose(mapped, KVStoreEntry.value), data, state)
      return state
    }
    default:
      return state
  }
}
