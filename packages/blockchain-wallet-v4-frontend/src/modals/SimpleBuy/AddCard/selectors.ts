import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const formValues = selectors.form.getFormValues('addCCForm')(state)
  const order = selectors.components.simpleBuy.getSBOrder(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )

  return lift(paymentMethods => ({ formValues, order, paymentMethods }))(
    paymentMethodsR
  )
}
