import { lift } from 'ramda'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const cardsR = selectors.components.buySell.getBSCards(state)
  const paymentMethodsR = selectors.components.buySell.getBSPaymentMethods(state)

  return lift((cards, paymentMethods) => ({ cards, paymentMethods }))(cardsR, paymentMethodsR)
}
