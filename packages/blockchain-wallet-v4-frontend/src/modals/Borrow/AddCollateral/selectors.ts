import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const coin = selectors.components.borrow.getCoinType(state)
  const limits = selectors.components.borrow.getLimits(state)
  const paymentR = selectors.components.borrow.getPayment(state)
  const ratesR = selectors.components.borrow.getRates(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  return lift((payment, rates, supportedCoins) => ({
    coin,
    limits,
    payment,
    rates,
    supportedCoins
  }))(paymentR, ratesR, supportedCoinsR)
}
