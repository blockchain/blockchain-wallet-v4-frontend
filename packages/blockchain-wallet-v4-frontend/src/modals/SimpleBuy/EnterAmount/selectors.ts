import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const cardsR = selectors.components.simpleBuy.getSBCards(state)
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const pairsR = selectors.components.simpleBuy.getSBPairs(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )

  return lift((cards, eligibility, pairs, paymentMethods) => ({
    cards,
    eligibility,
    pairs,
    paymentMethods
  }))(cardsR, eligibilityR, pairsR, paymentMethodsR)
}
