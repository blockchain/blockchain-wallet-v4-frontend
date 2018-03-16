import { over, mapped, set, view } from 'ramda-lens'
import { append, compose, findIndex, path, equals, lensIndex } from 'ramda'
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
    case AT.UPDATE_TRADE_STATUS_METADATA_SHAPESHIFT: {
      const { depositAddress, status } = payload

      return state.map(trades => {
        const lensTrades = compose(lensProp('value'), lensProp('trades'))

        const i = findIndex(
          compose(
            equals(depositAddress),
            path(['quote', 'deposit'])
          ))(view(lensTrades, trades))

        return set(
          compose(
            lensTrades,
            lensIndex(i),
            lensProp('status')),
          status, trades)
      })
    }
    default:
      return state
  }
}
