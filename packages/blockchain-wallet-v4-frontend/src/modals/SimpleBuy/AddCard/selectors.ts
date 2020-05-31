import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const fiatCurrency =
    selectors.components.simpleBuy.getFiatCurrency(state) || 'EUR'
  const formValues = selectors.form.getFormValues('addCCForm')(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )

  return lift(paymentMethods => ({ fiatCurrency, formValues, paymentMethods }))(
    paymentMethodsR
  )
}
