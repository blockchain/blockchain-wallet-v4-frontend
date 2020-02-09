import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const offersR = selectors.components.borrow.getOffers(state)
  const ratesR = selectors.components.borrow.getRates(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  const transform = (offers, rates, supportedCoins) => ({
    offers,
    rates,
    supportedCoins
  })

  return lift(transform)(offersR, ratesR, supportedCoinsR)
}
