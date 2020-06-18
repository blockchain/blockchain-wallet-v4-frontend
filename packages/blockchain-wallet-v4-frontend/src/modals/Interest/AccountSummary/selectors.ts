import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const accountBalancesR = selectors.components.interest.getInterestAccountBalance(
    state
  )
  const coin = selectors.components.interest.getCoinType(state)
  const interestLimitsR = selectors.components.interest.getInterestLimits(state)
  const interestRateR = selectors.components.interest.getInterestRate(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (
      accountBalances,
      interestLimits,
      interestRate,
      supportedCoins,
      walletCurrency
    ) => ({
      accountBalances,
      interestLimits,
      interestRate,
      lockupPeriod: interestLimits[coin].lockUpDuration / 86400,
      supportedCoins,
      walletCurrency
    })
  )(
    accountBalancesR,
    interestLimitsR,
    interestRateR,
    supportedCoinsR,
    walletCurrencyR
  )
}
