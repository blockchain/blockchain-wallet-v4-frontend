import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const userDataR = selectors.modules.profile.getUserData(state)

  const interestRateR = selectors.components.interest.getInterestRate(state)

  const transform = (interestRate, userData) => ({
    interestRate,
    userData
  })
  return lift(transform)(interestRateR, userDataR)
}
