import { lift } from 'ramda'

import { ExtractSuccess } from 'core/types'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const fastLinkR = selectors.components.simpleBuy.getFastLink(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )

  return lift(
    (
      fastLink: ExtractSuccess<typeof fastLinkR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>
    ) => ({
      fastLink,
      paymentMethods
    })
  )(fastLinkR, paymentMethodsR)
}
