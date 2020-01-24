import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const coin = selectors.components.borrow.getCoinType(state)
  const offersR = selectors.components.borrow.getOffers(state)
  const paymentR = selectors.components.borrow.getPayment(state)
  const ratesR = selectors.components.borrow.getRates(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  return lift((offers, payment, rates, supportedCoins) => ({
    coin,
    offers,
    payment,
    rates,
    supportedCoins
  }))(offersR, paymentR, ratesR, supportedCoinsR)
}
