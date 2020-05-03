import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const coin = selectors.components.interest.getCoinType(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const interestRateR = selectors.components.interest.getInterestRate(state)

  const transform = (interestRate, userData) => ({
    coin,
    interestRate,
    userData
  })
  return lift(transform)(interestRateR, userDataR)
}
