import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

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
