import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'

import { selectors } from 'data'

export const getData = (state: RootState) => {
  const bankAccountsR = selectors.components.simpleBuy.getBankTransferAccounts(
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
