import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const coin = selectors.components.interest.getCoinType(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const interestRateR = selectors.components.interest.getInterestRate(state)

  const transform = (interestRate, supportedCoins, userData) => ({
    coin,
    interestRate,
    supportedCoins,
    userData
  })
  return lift(transform)(interestRateR, supportedCoinsR, userDataR)
}
