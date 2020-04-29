import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const btcRateR = selectors.core.data.btc.getRates(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const interestRateR = selectors.components.interest.getInterestRate(state)

  const transform = (btcRate, interestRate, userData) => ({
    btcRate,
    interestRate,
    userData
  })
  return lift(transform)(btcRateR, interestRateR, userDataR)
}
