import { lift } from 'ramda'

import {
  ExtractSuccess,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = state => {
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(
    state
  )
  const defaultMethodR = selectors.components.brokerage.getAccount(state)
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )
  const depositLimitsR = selectors.components.simpleBuy.getUserLimit(
    state,
    'BANK_TRANSFER'
  )
  const formErrors = selectors.form.getFormSyncErrors('brokerageTx')(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const supportedCoins = supportedCoinsR.getOrElse(
    {} as SupportedWalletCurrenciesType
  )
  return lift(
    (
      bankTransferAccounts: ExtractSuccess<typeof bankTransferAccountsR>,
      depositLimits: ExtractSuccess<typeof depositLimitsR>,
      eligibility: ExtractSuccess<typeof eligibilityR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>
    ) => ({
      bankTransferAccounts,
      depositLimits,
      defaultMethod: defaultMethodR,
      eligibility,
      paymentMethods,
      supportedCoins,
      formErrors
    })
  )(bankTransferAccountsR, depositLimitsR, eligibilityR, paymentMethodsR)
}
