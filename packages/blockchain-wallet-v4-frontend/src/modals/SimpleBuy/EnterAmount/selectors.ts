import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )

  return lift((eligibility, paymentMethods) => ({
    eligibility,
    paymentMethods
  }))(eligibilityR, paymentMethodsR)
}
