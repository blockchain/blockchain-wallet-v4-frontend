import { contains, curry, filter, isEmpty, lift, or, prop } from 'ramda'
import { selectors, model } from 'data'

const { COMPLETE_STATES, INCOMPLETE_STATES } = model.components.exchangeHistory

/**
 * Statuses for shapeshift
 * States for exchange
 */
const getTradesWithStatus = curry((statuses, states, trades) =>
  filter(
    trade =>
      or(
        contains(prop('status', trade), statuses),
        contains(prop('state', trade), states)
      ),
    trades
  )
)

const { exchangeHistory, exchange } = selectors.components

export const getData = state => {
  const canUseExchange = exchange.canUseExchange(state)
  const tradesR = canUseExchange
    ? exchangeHistory.getTrades(state)
    : selectors.core.kvStore.shapeShift.getTrades(state)
  const allFetched = exchangeHistory.allFetched(state)
  const loadingNextPage = exchangeHistory.loadingNextPage(state)
  const completeTradesR = lift(
    getTradesWithStatus(
      ['complete', 'resolved', 'error', 'failed'],
      COMPLETE_STATES
    )
  )(tradesR)
  const incompleteTradesR = lift(
    getTradesWithStatus(['no_deposits', 'received'], INCOMPLETE_STATES)
  )(tradesR)

  const transform = (complete, incomplete) => {
    const showComplete = !isEmpty(complete)
    const showIncomplete = !isEmpty(incomplete)

    return {
      complete,
      showComplete,
      incomplete,
      showIncomplete,
      loadingNextPage
    }
  }
  return {
    data: lift(transform)(completeTradesR, incompleteTradesR),
    canUseExchange,
    canLoadNextPage: !loadingNextPage && !allFetched
  }
}
