import {
  assoc,
  assocPath,
  dissocPath,
  lensProp,
  prop,
  propOr,
  set
} from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import * as socketActionTypes from 'data/middleware/webSocket/rates/actionTypes'

import * as AT from './actionTypes'
import { FIX_TYPES, MAX_ERROR, MIN_ERROR } from './model'

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
  quote: Remote.NotAsked
}
const getPair = propOr(INITIAL_PAIR)
const quoteLens = lensProp('quote')
const configLens = lensProp('config')
const bestRatesLens = lensProp('bestRates')
const setPairProp = (lens, fn, pair, state) => {
  const pairValue = set(lens, fn, getPair(pair, state.pairs))
  return assocPath(['pairs', pair], pairValue, state)
}
const getError = error => {
  const description = prop('description', error)
  if (description === MIN_ERROR) return MIN_ERROR
  if (new RegExp(MAX_ERROR).test(description)) return MAX_ERROR

  return error
}

export default (state = INITIAL_STATE, action) => {
  const { payload, type } = action

  switch (type) {
    case AT.AVAILABLE_PAIRS_LOADING:
      return assoc('availablePairs', Remote.Loading, state)
    case AT.AVAILABLE_PAIRS_SUCCESS:
      return assoc('availablePairs', Remote.Success(payload.pairs), state)
    case AT.AVAILABLE_PAIRS_ERROR:
      return assoc('availablePairs', Remote.Failure(payload.error), state)
    case AT.UPDATE_PAIR_CONFIG:
      return setPairProp(configLens, payload.config, payload.pair, state)
    case AT.SET_PAIR_QUOTE:
      return setPairProp(
        quoteLens,
        Remote.Success(payload.quote),
        payload.pair,
        state
      )
    case AT.SUBSCRIBE_TO_ADVICE:
      return setPairProp(quoteLens, Remote.Loading, payload.pair, state)
    case socketActionTypes.ADVICE_SUBSCRIBE_ERROR:
      return setPairProp(
        quoteLens,
        Remote.Failure(getError(payload.error)),
        payload.pair,
        state
      )
    case AT.UPDATE_BEST_RATES: {
      return set(bestRatesLens, Remote.Success(payload.rates), state)
    }
    case AT.SUBSCRIBE_TO_RATES:
      return set(bestRatesLens, Remote.Loading, state)
    case socketActionTypes.RATES_SUBSCRIBE_ERROR:
      return set(bestRatesLens, Remote.Failure(payload.error), state)
    case AT.UNSUBSCRIBE_FROM_RATES:
      return set(bestRatesLens, Remote.NotAsked, state)
    case AT.REMOVE_ADVICE:
      return dissocPath(['pairs', payload.pair], state)
    default:
      return state
  }
}
