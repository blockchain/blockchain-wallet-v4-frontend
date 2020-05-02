import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const btcRateR = selectors.core.data.btc.getRates(state)
  const interestRateR = selectors.components.interest.getInterestRate(state)
  const limitsR = selectors.components.interest.getInterestLimits(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (rates, interestRate, limits, supportedCoins, walletCurrency) => ({
      interestRate,
      limits,
      rates,
      supportedCoins,
      walletCurrency
    })
  )(btcRateR, interestRateR, limitsR, supportedCoinsR, walletCurrencyR)
}
