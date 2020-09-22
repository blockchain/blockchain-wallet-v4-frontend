import * as AT from './actionTypes'
import { always, assoc, compose, identity, ifElse, map, propEq } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

const INITIAL_STATE = {
  loadingNextPage: false,
  allFetched: false,
  error: null,
  trades: Remote.NotAsked
}

const updateTrade = (id, tradeData) =>
  map(ifElse(propEq('id', id), always(tradeData), identity))

export function exchangeHistoryReducer (state = INITIAL_STATE, action) {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_TRADES_LOADING: {
      return compose(
        assoc('loadingNextPage', true),
        // @ts-ignore
        assoc('error', null)
      )(state)
    }
    case AT.FETCH_TRADES_SUCCESS: {
      return compose(
        assoc('loadingNextPage', false),
        // @ts-ignore
        assoc('error', null),
        assoc('trades', Remote.of(payload.trades))
      )(state)
    }
    case AT.FETCH_TRADES_ERROR: {
      return compose(
        assoc('error', payload.error),
        // @ts-ignore
        assoc('loadingNextPage', false)
      )(state)
    }
    case AT.UPDATE_TRADE: {
      return assoc(
        'trades',
        state.trades.map(updateTrade(payload.id, payload.trade)),
        state
      )
    }
    case AT.ALL_FETCHED: {
      return assoc('allFetched', true, state)
    }
    case AT.CLEAR_TRADES: {
      return INITIAL_STATE
    }
    default:
      return state
  }
}
