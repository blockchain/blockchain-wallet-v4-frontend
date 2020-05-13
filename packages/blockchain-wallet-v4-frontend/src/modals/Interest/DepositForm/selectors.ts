import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const ratesR = selectors.components.interest.getRates(state)
  const coin = selectors.components.interest.getCoinType(state)
  const interestLimitsR = selectors.components.interest.getInterestLimits(state)
  const interestRateR = selectors.components.interest.getInterestRate(state)
  const depositLimits = selectors.components.interest.getDepositLimits(state)
  const paymentR = selectors.components.interest.getPayment(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (
      rates,
      interestLimits,
      interestRate,
      payment,
      supportedCoins,
      walletCurrency
    ) => ({
      coin,
      depositLimits,
      interestLimits,
      interestRate,
      payment,
      rates,
      supportedCoins,
      walletCurrency
    })
  )(
    ratesR,
    interestLimitsR,
    interestRateR,
    paymentR,
    supportedCoinsR,
    walletCurrencyR
  )
}
