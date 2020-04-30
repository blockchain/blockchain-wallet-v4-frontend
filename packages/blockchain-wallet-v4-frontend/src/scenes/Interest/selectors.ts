import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const userDataR = selectors.modules.profile.getUserData(state)
  const interestHistoryR = selectors.components.interest.getInterestTransactions(
    state
  )
  const interestRateR = selectors.components.interest.getInterestRate(state)

  const transform = (interestHistory, interestRate, userData) => ({
    interestHistory,
    interestRate,
    userData
  })
  return lift(transform)(interestHistoryR, interestRateR, userDataR)
}
