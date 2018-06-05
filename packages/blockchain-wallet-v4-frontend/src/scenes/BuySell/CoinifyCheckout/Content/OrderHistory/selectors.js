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
    console.log('order history selector', tradesR, subscriptionsR)
    return lift(transform)(tradesR, subscriptionsR)
  }
)

// export const getData = (state) => ({
//   data: selectors.core.data.coinify.getTrades(state),
//   canTrade: selectors.core.data.coinify.canTrade(state).getOrElse(true),
//   trade: getTrade(state),
//   step: path(['coinify', 'checkoutStep'], state),
//   busy: path(['coinify', 'coinifyBusy'], state),
//   cancelTradeId: path(['coinify', 'cancelTradeId'], state)
// })



// import { lift } from 'ramda'
// import { selectors } from 'data'
// import { createDeepEqualSelector } from 'services/ReselectHelper'

// export const getData = createDeepEqualSelector(
//   [
//     selectors.core.data.coinify.getProfile,
//     selectors.core.data.coinify.getLimits,
//     selectors.core.data.coinify.getLevel,
//     selectors.core.data.coinify.getMediums,
//     selectors.core.data.coinify.getKycs
//   ],
//   (profileR, limitsR, levelR, mediumsR, kycsR) => {
//     const transform = (profile, limits, level, mediums, kycs) => {
//       return {
//         profile,
//         limits,
//         level,
//         mediums,
//         kycs
//       }
//     }
//     return lift(transform)(profileR, limitsR, levelR, mediumsR, kycsR)
//   }
// )
//
// export const getQuote = createDeepEqualSelector(
//   [selectors.core.data.coinify.getQuote],
//   (quoteR) => {
//     const transform = quote => quote
//     return lift(transform)(quoteR)
//   }
// )
