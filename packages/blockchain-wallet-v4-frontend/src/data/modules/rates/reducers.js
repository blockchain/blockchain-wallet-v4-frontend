import {
  assoc,
  assocPath,
  compose,
  dissocPath,
  groupBy,
  head,
  lensProp,
  map,
  propOr,
  prop,
  set
} from 'ramda'

import * as socketActionTypes from 'data/middleware/webSocket/rates/actionTypes'
import * as AT from './actionTypes'
import { FIX_TYPES } from './model'
import { Remote } from 'blockchain-wallet-v4'

const INITIAL_STATE = {
  availablePairs: Remote.NotAsked,
  pairs: {},
  bestRates: Remote.NotAsked
}
const INITIAL_PAIR = {
  config: {
    fix: FIX_TYPES.BASE,
    volume: 0,
    fiatCurrency: 'USD'
  },
  advice: Remote.NotAsked
}
const getPair = propOr(INITIAL_PAIR)
const adviceLens = lensProp('advice')
const configLens = lensProp('config')
const bestRatesLens = lensProp('bestRates')
const setPairProp = (lens, fn, pair, state) => {
  const pairValue = set(lens, fn, getPair(pair, state.pairs))
  return assocPath(['pairs', pair], pairValue, state)
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.AVAILABLE_PAIRS_LOADING:
      return assoc('availablePairs', Remote.Loading, state)
    case AT.AVAILABLE_PAIRS_SUCCESS:
      return assoc('availablePairs', Remote.Success(payload.pairs), state)
    case AT.AVAILABLE_PAIRS_ERROR:
      return assoc('availablePairs', Remote.Failure(payload.error), state)
    case AT.UPDATE_PAIR_CONFIG:
      return setPairProp(configLens, payload.config, payload.pair, state)
    case AT.SET_PAIR_ADVICE:
      return setPairProp(
        adviceLens,
        Remote.Success(payload.advice),
        payload.pair,
        state
      )
    case AT.SUBSCRIBE_TO_ADVICE:
      return setPairProp(adviceLens, Remote.Loading, payload.pair, state)
    case socketActionTypes.ADVICE_SUBSCRIBE_ERROR:
      return setPairProp(
        adviceLens,
        Remote.Failure(payload.error),
        payload.pair,
        state
      )
    case AT.UNSUBSCRIBE_FROM_ADVICE:
      return dissocPath(['pairs', payload.pair], state)
    case AT.UPDATE_BEST_RATES: {
      const pairs = compose(
        map(head),
        groupBy(prop('pair'))
      )(payload.rates)
      return set(bestRatesLens, Remote.Success(pairs), state)
    }
    case AT.SUBSCRIBE_TO_RATES:
      return set(bestRatesLens, Remote.Loading, state)
    case socketActionTypes.RATES_SUBSCRIBE_ERROR:
      return set(bestRatesLens, Remote.Failure(payload.error), state)
    case AT.UNSUBSCRIBE_FROM_RATES:
      return set(bestRatesLens, Remote.NotAsked, state)
    default:
      return state
  }
}
