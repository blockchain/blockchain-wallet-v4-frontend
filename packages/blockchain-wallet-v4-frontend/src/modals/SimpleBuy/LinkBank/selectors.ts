import { lift } from 'ramda'

import { ExtractSuccess } from 'core/types'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )

  return lift((paymentMethods: ExtractSuccess<typeof paymentMethodsR>) => ({
    paymentMethods
  }))(paymentMethodsR)
}
