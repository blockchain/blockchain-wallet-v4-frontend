import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const cardsR = selectors.components.simpleBuy.getSBCards(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )

  return lift((cards, paymentMethods) => ({ cards, paymentMethods }))(
    cardsR,
    paymentMethodsR
  )
}
