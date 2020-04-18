import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const coin = selectors.components.interest.getCoinType(state)
  const ratesR = selectors.components.borrow.getRates(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const interestLimitsR = selectors.components.interest.getInterestLimits(state)

  return lift((rates, supportedCoins, interestLimits) => ({
    coin,
    minimumDeposit: interestLimits[coin].minimumDeposit,
    rates,
    supportedCoins
  }))(ratesR, supportedCoinsR, interestLimitsR)
}
