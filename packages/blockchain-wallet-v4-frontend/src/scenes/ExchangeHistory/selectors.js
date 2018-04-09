import { difference, equals, filter, lift, prop } from 'ramda'
import { selectors } from 'data'

const getTradesWithStatus = (trades, status) => filter(trade => equals(prop('status', trade), status), trades)

export const getData = (state) => {
  const trades = selectors.core.kvStore.shapeShift.getTrades(state)
  const completedTrades = trades.map(t => getTradesWithStatus(t, 'complete'))
  const incompleteTrades = trades.map(t => difference(t, completedTrades.getOrElse([])))
  return lift((c, i) => ({ complete: c, incomplete: i }))(completedTrades, incompleteTrades)
}
