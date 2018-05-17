import { anyPass, concat, curry, equals, filter, isEmpty, lift, map, prop } from 'ramda'
import { selectors } from 'data'

const getTradesWithStatus = curry((statuses, trades) =>
  filter(trade => anyPass(map(equals, statuses))(prop('status', trade)), trades))

export const getData = (state) => {
  const trades = selectors.core.kvStore.shapeShift.getTrades(state)
  const completedTrades = lift(getTradesWithStatus(['complete', 'resolved']))(trades)
  const errorTrades = lift(getTradesWithStatus(['error', 'failed']))(trades)
  const incompleteTrades = lift(getTradesWithStatus(['no_deposits', 'received']))(trades)

  const transform = (c, i, e) => {
    const incomplete = concat(i, e)
    const showComplete = !isEmpty(c)
    const showIncomplete = !isEmpty(incomplete)

    return {
      complete: c,
      showComplete,
      incomplete,
      showIncomplete
    }
  }
  return lift(transform)(completedTrades, incompleteTrades, errorTrades)
}
