import { assoc } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  price_index_series: Remote.NotAsked
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_PRICE_INDEX_SERIES_LOADING: {
      return assoc('price_index_series', Remote.Loading, state)
    }
    case AT.FETCH_PRICE_INDEX_SERIES_SUCCESS: {
      return assoc('price_index_series', Remote.Success(payload), state)
    }
    case AT.FETCH_PRICE_INDEX_SERIES_FAILURE: {
      return assoc('price_index_series', Remote.Failure(payload), state)
    }
    default:
      return state
  }
}
