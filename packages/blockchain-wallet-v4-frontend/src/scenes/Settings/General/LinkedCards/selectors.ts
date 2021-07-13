import { lift } from 'ramda'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

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
