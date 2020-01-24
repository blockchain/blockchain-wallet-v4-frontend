import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const coin = selectors.components.borrow.getCoinType(state)
  const offersR = selectors.components.borrow.getOffers(state)
  const paymentR = selectors.components.borrow.getPayment(state)
  const ratesR = selectors.components.borrow.getRates(state)

  return lift((offers, payment, rates) => ({ coin, offers, payment, rates }))(
    offersR,
    paymentR,
    ratesR
  )
}
