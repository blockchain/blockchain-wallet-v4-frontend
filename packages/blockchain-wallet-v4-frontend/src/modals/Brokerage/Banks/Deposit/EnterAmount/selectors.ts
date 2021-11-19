import { lift } from 'ramda'

import { CrossBorderLimits, ExtractSuccess, SBPaymentTypes } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BankTransferAccountType } from 'data/types'

const getData = (state: RootState) => {
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(state)
  const bankTransferAccounts = bankTransferAccountsR.getOrElse([] as BankTransferAccountType[])
  const defaultMethodR = selectors.components.brokerage.getAccount(state)
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(state)
  const depositLimitsR = selectors.components.simpleBuy.getUserLimit(
    state,
    SBPaymentTypes.BANK_TRANSFER
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
