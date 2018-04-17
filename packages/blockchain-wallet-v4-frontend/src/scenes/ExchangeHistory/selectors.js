import { difference, equals, filter, lift, or, prop } from 'ramda'
import { selectors } from 'data'

const getTradesWithStatus = (trades, status1, status2) => filter(trade => or(equals(prop('status', trade), status1), equals(prop('status', trade), status2)), trades)

export const getData = (state) => {
  const trades = selectors.core.kvStore.shapeShift.getTrades(state)
  const completedTrades = trades.map(t => getTradesWithStatus(t, 'complete', 'resolved'))
  const incompleteTrades = lift((t, completed) => difference(t, completed))(trades, completedTrades)
  return lift((c, i) => ({ complete: c, incomplete: i }))(completedTrades, incompleteTrades)
}
