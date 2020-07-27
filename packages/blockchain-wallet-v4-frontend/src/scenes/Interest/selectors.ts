import { lift, values } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const userDataR = selectors.modules.profile.getUserData(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const interestRateR = selectors.components.interest.getInterestRate(state)
  const instrumentsR = selectors.components.interest.getInterestInstruments(
    state
  )
  const interestEligibleR = selectors.components.interest.getInterestEligible(
    state
  )

  const transform = (
    instruments,
    interestRate,
    supportedCoins,
    userData,
    interestEligible
  ) => ({
    instruments,
    interestRate,
    interestRateArray: values(interestRate),
    supportedCoins,
    userData,
    interestEligible
  })
  return lift(transform)(
    instrumentsR,
    interestRateR,
    supportedCoinsR,
    userDataR,
    interestEligibleR
  )
}
