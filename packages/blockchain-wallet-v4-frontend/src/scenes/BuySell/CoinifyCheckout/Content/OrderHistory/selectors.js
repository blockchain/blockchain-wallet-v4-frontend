import { selectors } from 'data'
import { lift } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getTrade = state =>
  selectors.core.data.coinify.getTrade(state).getOrElse(null)

export const getData = createDeepEqualSelector(
  [
    selectors.core.data.coinify.getTrades,
    selectors.core.data.coinify.getSubscriptions,
    selectors.core.data.coinify.canTrade
  ],
  (tradesR, subscriptionsR, canTradeR) => {
    const transform = (trades, subscriptions, canTrade) => {
      return {
        trades,
        subscriptions,
        canTrade
      }
    }
    return lift(transform)(tradesR, subscriptionsR, canTradeR)
  }
)
