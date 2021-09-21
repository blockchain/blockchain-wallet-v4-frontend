import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const bankCredentialsR = selectors.components.brokerage.getBankCredentials(
    state
  )
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )

  return lift(
    (
      bankCredentials: ExtractSuccess<typeof bankCredentialsR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>
    ) => ({
      bankCredentials,
      paymentMethods
    })
  )(bankCredentialsR, paymentMethodsR)
}
