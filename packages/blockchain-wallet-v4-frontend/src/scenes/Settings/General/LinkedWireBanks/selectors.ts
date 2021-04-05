import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const bankAccountsR = selectors.components.brokerage.getBankTransferAccounts(
    state
  )

  const beneficiariesR = selectors.custodial.getBeneficiaries(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )
  return lift(
    (
      bankAccounts: ExtractSuccess<typeof bankAccountsR>,
      beneficiaries: ExtractSuccess<typeof beneficiariesR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>
    ) => ({
      bankAccounts,
      beneficiaries,
      paymentMethods
    })
  )(bankAccountsR, beneficiariesR, paymentMethodsR)
}
