import { anyPass, curry, equals, filter, lift, map, prop } from 'ramda'
import { selectors } from 'data'

const getTradesWithStatus = curry((statuses, trades) =>
  filter(trade => anyPass(map(equals, statuses))(prop('status', trade)), trades))

export const getData = (state) => {
  const trades = selectors.core.kvStore.shapeShift.getTrades(state)
  const completedTrades = lift(getTradesWithStatus(['complete', 'resolved']))(trades)
  const errorTrades = lift(getTradesWithStatus(['error', 'failed']))(trades)
  const incompleteTrades = lift(getTradesWithStatus(['no_deposits']))(trades)
  return lift((c, i, e) =>
    ({ complete: c, incomplete: i, error: e }))(completedTrades, incompleteTrades, errorTrades)
}
