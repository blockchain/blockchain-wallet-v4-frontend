import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  // TODO: Move payment methods reducer to brokerage
  const paymentMethodsR = selectors.components.buySell.getBSPaymentMethods(state)

  return lift((paymentMethods: ExtractSuccess<typeof paymentMethodsR>) => ({
    paymentMethods
  }))(paymentMethodsR)
}
