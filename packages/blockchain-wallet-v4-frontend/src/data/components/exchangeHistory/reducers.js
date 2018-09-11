import { assoc, compose } from 'ramda'
import * as AT from './actionTypes'
import { Remote } from 'blockchain-wallet-v4/src'

const INITIAL_STATE = {
  loadingNextPage: false,
  allFetched: false,
  trades: Remote.NotAsked
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_TRADES_LOADING: {
      return assoc('loadingNextPage', true, state)
    }
    case AT.FETCH_TRADES_SUCCESS: {
      return compose(
        assoc('loadingNextPage', false),
        assoc('trades', Remote.of(payload.trades))
      )(state)
    }
    case AT.FETCH_TRADES_ERROR: {
      return compose(
        assoc('loadingNextPage', false),
        assoc('trades', payload.trades)
      )(state)
    }
    case AT.ALL_FETCHED: {
      return assoc('allFetched', false, state)
    }
    case AT.CLEAR_TRADES: {
      return INITIAL_STATE
    }
    default:
      return state
  }
}
