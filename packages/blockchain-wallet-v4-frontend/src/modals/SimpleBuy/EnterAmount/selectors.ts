import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const cardsR = selectors.components.simpleBuy.getSBCards(state)
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )

  return lift((cards, eligibility, paymentMethods) => ({
    cards,
    eligibility,
    paymentMethods
  }))(cardsR, eligibilityR, paymentMethodsR)
}
