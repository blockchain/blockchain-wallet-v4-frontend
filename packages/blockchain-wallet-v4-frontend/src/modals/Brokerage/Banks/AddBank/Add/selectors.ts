import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const fastLinkR = selectors.components.brokerage.getFastLink(state)
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
