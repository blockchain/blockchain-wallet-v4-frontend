import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const bankAccountsR = selectors.components.brokerage.getBankTransferAccounts(state)

  const beneficiariesR = selectors.custodial.getBeneficiaries(state)
  const paymentMethodsR = selectors.components.buySell.getBSPaymentMethods(state)
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
