import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const interestHistoryR = selectors.components.interest.getInterestTransactions(
    state
  )
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const userDataR = selectors.modules.profile.getUserData(state)

  const transform = (interestHistory, supportedCoins, userData) => ({
    interestHistory,
    supportedCoins,
    userData
  })
  return lift(transform)(interestHistoryR, supportedCoinsR, userDataR)
}
