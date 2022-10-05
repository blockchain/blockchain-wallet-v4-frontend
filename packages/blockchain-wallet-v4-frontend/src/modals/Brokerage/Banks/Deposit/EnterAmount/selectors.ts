import { lift } from 'ramda'

import { BSPaymentTypes, CrossBorderLimits, ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BankTransferAccountType } from 'data/types'

const getData = (state: RootState) => {
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(state)
  const bankTransferAccounts = bankTransferAccountsR.getOrElse([] as BankTransferAccountType[])
  const defaultMethodR = selectors.components.brokerage.getActiveAccount(state)
  const eligibilityR = selectors.components.buySell.getBSFiatEligible(state)
  const paymentMethodsR = selectors.components.buySell.getBSPaymentMethods(state)
  const depositLimitsR = selectors.components.buySell.getUserLimit(
    state,
    BSPaymentTypes.BANK_TRANSFER
  )
  const crossBorderLimits = selectors.components.brokerage
    .getCrossBorderLimits(state)
    .getOrElse({} as CrossBorderLimits)

  const formErrors = selectors.form.getFormAsyncErrors('brokerageTx')(state)
  return lift(
    (
      depositLimits: ExtractSuccess<typeof depositLimitsR>,
      eligibility: ExtractSuccess<typeof eligibilityR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>
    ) => ({
      bankTransferAccounts,
      crossBorderLimits,
      defaultMethod: defaultMethodR,
      depositLimits,
      eligibility,
      formErrors,
      paymentMethods
    })
  )(depositLimitsR, eligibilityR, paymentMethodsR)
}

export default getData
