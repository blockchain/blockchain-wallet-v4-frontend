import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'

import { selectors } from 'data'

export const getData = (state: RootState) => {
  const bankAccountsR = selectors.components.brokerage.getBankTransferAccounts(
    state
  )

  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )
  return lift(
    (
      bankAccounts: ExtractSuccess<typeof bankAccountsR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>
    ) => ({
      bankAccounts,
      paymentMethods
    })
  )(bankAccountsR, paymentMethodsR)
}
