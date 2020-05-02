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

  const transform = (interestAccountBalance, interestEligible) => ({
    interestAccountBalance,
    interestEligible,
    showInterestInfoBox
  })

  return lift(transform)(interestAccountBalanceR, interestEligibleR)
}
