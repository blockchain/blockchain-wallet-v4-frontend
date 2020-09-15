import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const ratesR = selectors.components.borrow.getRates(state)
  const paymentR = selectors.components.borrow.getPayment(state)

  return lift((rates, payment) => ({ rates, payment }))(ratesR, paymentR)
}
