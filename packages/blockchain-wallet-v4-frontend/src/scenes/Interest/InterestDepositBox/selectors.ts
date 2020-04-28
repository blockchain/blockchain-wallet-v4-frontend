import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const interestAccountBalanceR = selectors.components.interest.getInterestAccountBalance(
    state
  )
  const interestEligibleR = selectors.components.interest.getInterestEligible(
    state
  )
  const interestRateR = selectors.components.interest.getInterestRate(state)

  const transform = (
    supportedCoins,
    interestAccountBalance,
    interestEligible,
    interestRate
  ) => ({
    supportedCoins,
    interestAccountBalance,
    interestEligible,
    interestRate
  })

  return lift(transform)(
    supportedCoinsR,
    interestAccountBalanceR,
    interestEligibleR,
    interestRateR
  )
}
