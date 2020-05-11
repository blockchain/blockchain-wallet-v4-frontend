import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const fiatCurrency =
    selectors.components.simpleBuy.getFiatCurrency(state) || 'EUR'
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )

  return lift(paymentMethods => ({ fiatCurrency, paymentMethods }))(
    paymentMethodsR
  )
}
