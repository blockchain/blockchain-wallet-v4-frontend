import { selectors } from 'data'
import { lift } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getTrade = (state) => {
  try {
    return selectors.core.data.coinify.getTrade(state).data
  } catch (e) {
    return null
  }
}

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
