import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const interestAccountBalanceR = selectors.components.interest.getInterestAccountBalance(
    state
  )
  const interestEligibleR = selectors.components.interest.getInterestEligible(
    state
  )
  const showInterestInfoBox = selectors.preferences.getShowInterestInfoBox(
    state
  )
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  const transform = (
    interestAccountBalance,
    interestEligible,
    supportedCoins,
    walletCurrency
  ) => ({
    interestAccountBalance,
    interestEligible,
    showInterestInfoBox,
    supportedCoins,
    walletCurrency
  })

  return lift(transform)(
    interestAccountBalanceR,
    interestEligibleR,
    supportedCoinsR,
    walletCurrencyR
  )
}
