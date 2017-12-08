import { assoc, compose, filter, head, map, path, prop } from 'ramda'
import * as selectors from './../../selectors'

export const getExchangeHistory = (state) => {
  const trades = selectors.core.kvStore.shapeShift.getTrades(state)
  const tradesStatus = selectors.core.data.shapeShift.getTradesStatus(state)
  const selectTradeStatus = x => statuses => head(filter(x => path(['quote', 'deposit']), statuses))
  const appendDetails = x => statuses => compose(
    assoc('exchangedAmount', prop('incomingCoin', selectTradeStatus(x, statuses))),
    assoc('exchangedCoin', prop('incomingType', selectTradeStatus(x, statuses))),
    assoc('receivedAmount', prop('outgoingCoin', selectTradeStatus(x, statuses))),
    assoc('receivedCoin', prop('outgoingType', selectTradeStatus(x, statuses)))
  )

  return {
    data: map(x => appendDetails(x, tradesStatus), trades)
  }
}
