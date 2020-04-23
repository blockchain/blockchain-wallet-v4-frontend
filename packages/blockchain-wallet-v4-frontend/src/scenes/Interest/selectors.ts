import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const interestAccountR = selectors.components.interest.getInterestPaymentAccount(
    state
  )
  // const interestEligibleR = selectors.components.interest.getInterestEligible(
  //   state
  // )
  const interestRateR = selectors.components.interest.getInterestRate(state)

  const transform = (
    supportedCoins,
    interestAccount,
    // interestEligible,
    interestRate
  ) => ({
    supportedCoins,
    interestAccount,
    // interestEligible,
    interestRate
  })

  return lift(transform)(
    supportedCoinsR,
    interestAccountR,
    // interestEligibleR,
    interestRateR
  )
}
