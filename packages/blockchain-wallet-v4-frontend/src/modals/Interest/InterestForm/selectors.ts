import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const coin = selectors.components.borrow.getCoinType(state)
  const ratesR = selectors.components.borrow.getRates(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  return lift((rates, supportedCoins) => ({
    coin,
    rates,
    supportedCoins
  }))(ratesR, supportedCoinsR)
}
