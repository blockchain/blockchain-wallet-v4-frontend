import { lift } from 'ramda'

import {
  ExtractSuccess,
  SBPaymentTypes,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { BankTransferAccountType } from 'data/types'

const getData = (state) => {
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(state)
  const bankTransferAccounts = bankTransferAccountsR.getOrElse([] as BankTransferAccountType[])
  const defaultMethodR = selectors.components.brokerage.getAccount(state)
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(state)
  const depositLimitsR = selectors.components.simpleBuy.getUserLimit(
    state,
    SBPaymentTypes.BANK_TRANSFER
  )
  const formErrors = selectors.form.getFormSyncErrors('brokerageTx')(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const supportedCoins = supportedCoinsR.getOrElse({} as SupportedWalletCurrenciesType)
  return lift(
    (
      depositLimits: ExtractSuccess<typeof depositLimitsR>,
      eligibility: ExtractSuccess<typeof eligibilityR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>
    ) => ({
      bankTransferAccounts,
      defaultMethod: defaultMethodR,
      depositLimits,
      eligibility,
      formErrors,
      paymentMethods,
      supportedCoins
    })
  )(depositLimitsR, eligibilityR, paymentMethodsR)
}

export default getData
