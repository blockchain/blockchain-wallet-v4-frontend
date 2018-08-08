import {
  propOr,
  assoc,
  dissocPath,
  inc,
  over,
  set,
  lensProp,
  dec,
  assocPath
} from 'ramda'

import * as SAT from 'data/middleware/webSocket/rates/actionTypes'
import * as AT from './actionTypes'
import { Remote } from 'blockchain-wallet-v4'

const INITIAL_STATE = {
  availablePairs: Remote.NotAsked,
  pairs: {}
}
const INITIAL_PAIR = {
  quote: Remote.NotAsked,
  refs: 0
}
const getPair = propOr(INITIAL_PAIR)
const refLens = lensProp('refs')
const quoteLens = lensProp('quote')
const overPairProp = (lens, fn, pair, state) => {
  const pairValue = over(lens, fn, getPair(pair, state.pairs))
  return assocPath(['pairs', pair], pairValue, state)
}
const setPairProp = (lens, fn, pair, state) => {
  const pairValue = set(lens, fn, getPair(pair, state.pairs))
  return assocPath(['pairs', pair], pairValue, state)
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.INCREASE_REF_COUNT:
      return overPairProp(refLens, inc, payload.pair, state)
    case AT.DECREASE_REF_COUNT:
      return overPairProp(refLens, dec, payload.pair, state)
    case AT.AVAILABLE_PAIRS_LOADING:
      return assoc('availablePairs', Remote.Loading, state)
    case AT.AVAILABLE_PAIRS_SUCCESS:
      return assoc('availablePairs', Remote.Success(payload.pairs), state)
    case AT.AVAILABLE_PAIRS_ERROR:
      return assoc('availablePairs', Remote.Failure(payload.error), state)
    case SAT.SUBSCRIBE_SUCCESS:
      return setPairProp(quoteLens, Remote.Loading, payload.pair, state)
    case SAT.UPDATE_QUOTE:
      return setPairProp(
        quoteLens,
        Remote.Success(payload.quote),
        payload.pair,
        state
      )
    case SAT.SUBSCRIBE_ERROR:
      return setPairProp(
        quoteLens,
        Remote.Failure(payload.error),
        payload.pair,
        state
      )
    case SAT.UNSUBSCRIBE_SUCCESS:
      return dissocPath(['pairs', payload.pair], state)
    default:
      return state
  }
}
