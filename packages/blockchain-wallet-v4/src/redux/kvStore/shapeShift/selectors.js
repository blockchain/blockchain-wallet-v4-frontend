import {
  compose,
  curry,
  equals,
  filter,
  head,
  path,
  reverse,
  sortBy,
  prop,
  contains
} from 'ramda'
import { SHAPESHIFT } from '../config'
import { kvStorePath } from '../../paths'

export const getMetadata = path([kvStorePath, SHAPESHIFT])
export const getUsState = state =>
  getMetadata(state).map(path(['value', 'USAState']))
export const getTrades = state =>
  getMetadata(state).map(
    compose(
      reverse,
      sortBy(prop('timestamp')),
      path(['value', 'trades'])
    )
  )
export const getTrade = curry((address, state) =>
  getTrades(state).map(
    compose(
      head,
      filter(x => equals(path(['quote', 'deposit'], x), address))
    )
  )
)

export const getShapeshiftTxHashMatch = (state, hash) =>
  getMetadata(state)
    .map(data => {
      const trades = getTrades(state).getOrElse([])

      const tradesHashIn = trades.map(t => t.hashIn)
      const tradesHashOut = trades.map(t => t.hashOut)

      const hasHashInLabel = contains(hash, tradesHashIn)
      const hasHashOutLabel = contains(hash, tradesHashOut)

      if (hasHashInLabel || hasHashOutLabel) return 'shift'
      return null
    })
    .getOrElse(false)
