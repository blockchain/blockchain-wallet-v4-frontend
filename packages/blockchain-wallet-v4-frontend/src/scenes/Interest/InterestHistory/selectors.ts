import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const interestHistoryR = selectors.components.interest.getInterestTransactions(
    state
  )
  const interestTransactionsR = selectors.components.interest.getInterestTransactions(
    state
  )
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const userDataR = selectors.modules.profile.getUserData(state)

  const transform = (
    interestHistory,
    interestTransactions,
    supportedCoins,
    userData
  ) => ({
    interestHistory,
    interestTransactions,
    supportedCoins,
    userData
  })
  return lift(transform)(
    interestHistoryR,
    interestTransactionsR,
    supportedCoinsR,
    userDataR
  )
}
