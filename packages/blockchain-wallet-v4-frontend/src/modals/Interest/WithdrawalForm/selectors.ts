import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const coin = selectors.components.interest.getCoinType(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  return lift(supportedCoins => ({
    coin,
    supportedCoins
  }))(supportedCoinsR)
}
