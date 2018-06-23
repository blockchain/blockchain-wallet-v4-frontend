import { selectors } from 'data'
import { lift } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getTrade = (state) =>
  selectors.core.data.coinify.getTrade(state).getOrElse(null)

export const getData = createDeepEqualSelector(
  [
    selectors.core.data.coinify.getTrades,
    selectors.core.data.coinify.getSubscriptions
  ],
  (tradesR, subscriptionsR, tradeR) => {
    const transform = (trades, subscriptions) => {
      return {
        trades,
        subscriptions
      }
    }
    return lift(transform)(tradesR, subscriptionsR)
  }
)
