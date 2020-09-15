import { contains, curry, filter, isEmpty, lift, or, prop } from 'ramda'
import { model, selectors } from 'data'

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

const { exchangeHistory } = selectors.components

export const getData = state => {
  const coinModels = selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail()
  const canUseExchange = true
  const tradesR = exchangeHistory.getTrades(state)
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
      coinModels,
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
