import {
  ExtractSuccess,
  FiatType,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
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
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const supportedCoins = supportedCoinsR.getOrElse(
    {} as SupportedWalletCurrenciesType
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
      walletCurrency,
      supportedCoins
    })
  )(bankTransferAccountsR, eligibilityR, paymentMethodsR, walletCurrencyR)
}
