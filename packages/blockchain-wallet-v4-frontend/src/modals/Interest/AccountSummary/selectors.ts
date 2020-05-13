import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const coin = selectors.components.interest.getCoinType(state)
  const accountBalancesR = selectors.components.interest.getInterestAccountBalance(
    state
  )
  const interestLimitsR = selectors.components.interest.getInterestLimits(state)
  const interestRateR = selectors.components.interest.getInterestRate(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  return lift(
    (accountBalances, interestLimits, interestRate, supportedCoins) => ({
      accountBalances,
      coin,
      interestLimits,
      interestRate,
      supportedCoins
    })
  )(accountBalancesR, interestLimitsR, interestRateR, supportedCoinsR)
}
