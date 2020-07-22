import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const cardsR = selectors.components.simpleBuy.getSBCards(state)
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )
  const balancesR = selectors.components.simpleBuy.getSBBalances(state)

  return lift(
    (
      cards: ExtractSuccess<typeof cardsR>,
      eligibility: ExtractSuccess<typeof eligibilityR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>,
      balances: ExtractSuccess<typeof balancesR>
    ) => ({
      cards,
      eligibility,
      paymentMethods,
      balances
    })
  )(cardsR, eligibilityR, paymentMethodsR, balancesR)
}
