import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const cardsR = selectors.components.simpleBuy.getSBCards(state)
  const defaultMethodR = selectors.components.simpleBuy.getDefaultPaymentMethod(
    state
  )
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )

  return lift(
    (
      cards: ExtractSuccess<typeof cardsR>,
      defaultMethod: ExtractSuccess<typeof defaultMethodR>,
      eligibility: ExtractSuccess<typeof eligibilityR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>
    ) => ({
      cards,
      defaultMethod,
      eligibility,
      paymentMethods
    })
  )(cardsR, defaultMethodR, eligibilityR, paymentMethodsR)
}
