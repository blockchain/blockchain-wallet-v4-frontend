import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const offer = selectors.components.borrow.getOffer(state)
  const ratesR = selectors.components.borrow.getRates(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  const transform = (rates, supportedCoins) => ({
    offer,
    rates,
    supportedCoins
  })

  return lift(transform)(ratesR, supportedCoinsR)
}
