import { selectors } from 'data'
import { concat, curry, lift, map } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { Remote } from 'blockchain-wallet-v4/src'

export const getTrade = state =>
  selectors.core.data.coinify.getTrade(state).getOrElse(null)

const addPartner = curry((partner, trade) => {
  trade.partner = partner
  return trade
})

export const getData = createDeepEqualSelector(
  [
    selectors.core.data.coinify.getTrades,
    selectors.core.data.sfox.getTrades,
    selectors.core.data.coinify.getSubscriptions,
    selectors.core.data.coinify.canTrade
  ],
  (coinifyTradesR, sfoxTradesR, subscriptionsR, canTradeR) => {
    const isLoading =
      Remote.Loading.is(subscriptionsR) ||
      Remote.Loading.is(coinifyTradesR) ||
      Remote.Loading.is(sfoxTradesR)
    const subscriptions = subscriptionsR.getOrElse([])
    const coinifyTrades = map(
      addPartner('coinify'),
      coinifyTradesR.getOrElse([])
    )
    const sfoxTrades = map(addPartner('sfox'), sfoxTradesR.getOrElse([]))

    const transform = canTrade => {
      return {
        trades: concat(coinifyTrades, sfoxTrades),
        subscriptions,
        isLoading,
        canTrade
      }
    }
    return lift(transform)(canTradeR)
  }
)
