import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const coin = selectors.components.borrow.getCoinType(state)
  const interestAccountBalanceR = selectors.components.interest.getInterestAccountBalance(
    state
  )
  const interestRateR = selectors.components.interest.getInterestRate(state)
  const ratesR = selectors.components.borrow.getRates(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  return lift(
    (interestAccountBalance, interestRate, rates, supportedCoins) => ({
      coin,
      interestAccountBalance,
      interestRate,
      rates,
      supportedCoins
    })
  )(interestAccountBalanceR, interestRateR, ratesR, supportedCoinsR)
}
