import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const paymentR = selectors.components.borrow.getPayment(state)
  const ratesR = selectors.components.borrow.getRates(state)
  const limits = selectors.components.borrow.getLimits(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  const transform = (payment, rates, supportedCoins) => ({
    payment,
    rates,
    limits,
    supportedCoins
  })

  return lift(transform)(paymentR, ratesR, supportedCoinsR)
}
