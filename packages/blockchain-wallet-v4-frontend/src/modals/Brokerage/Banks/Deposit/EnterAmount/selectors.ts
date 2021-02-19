import { ExtractSuccess, FiatType } from 'core/types'
import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(
    state
  )
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  const defaultMethodR = selectors.components.brokerage.getAccount(state)
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )

  return lift(
    (
      bankTransferAccounts: ExtractSuccess<typeof bankTransferAccountsR>,
      eligibility: ExtractSuccess<typeof eligibilityR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>,
      walletCurrency: FiatType
    ) => ({
      bankTransferAccounts,
      defaultMethod: defaultMethodR,
      eligibility,
      paymentMethods,
      walletCurrency
    })
  )(bankTransferAccountsR, eligibilityR, paymentMethodsR, walletCurrencyR)
}
