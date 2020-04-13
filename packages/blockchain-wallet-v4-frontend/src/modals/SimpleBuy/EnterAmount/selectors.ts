import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const pairsR = selectors.components.simpleBuy.getSBPairs(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )

  return lift((eligibility, pairs, paymentMethods) => ({
    eligibility,
    pairs,
    paymentMethods
  }))(eligibilityR, pairsR, paymentMethodsR)
}
