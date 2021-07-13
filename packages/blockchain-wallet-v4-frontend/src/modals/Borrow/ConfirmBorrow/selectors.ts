import { lift } from 'ramda'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const ratesR = selectors.components.borrow.getRates(state)
  const paymentR = selectors.components.borrow.getPayment(state)

  return lift((rates, payment) => ({ rates, payment }))(ratesR, paymentR)
}
