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
  const btcRateR = selectors.core.data.btc.getRates(state)

  const transform = (
    supportedCoins,
    interestAccountBalance,
    interestEligible,
    interestRate,
    btcRate
  ) => ({
    supportedCoins,
    interestAccountBalance,
    interestEligible,
    interestRate,
    btcRate
  })

  return lift(transform)(
    supportedCoinsR,
    interestAccountBalanceR,
    interestEligibleR,
    interestRateR,
    btcRateR
  )
}
