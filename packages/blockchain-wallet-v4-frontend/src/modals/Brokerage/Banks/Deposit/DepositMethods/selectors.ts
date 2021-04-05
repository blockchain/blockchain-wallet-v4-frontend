import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = state => {
  const balancesR = selectors.components.simpleBuy.getSBBalances(state)
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(
    state
  )
  // TODO: Move payment methods reducer to brokerage
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (
      balances: ExtractSuccess<typeof balancesR>,
      bankTransferAccounts: ExtractSuccess<typeof bankTransferAccountsR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>,
      walletCurrency: FiatType
    ) => ({
      balances,
      bankTransferAccounts,
      paymentMethods,
      walletCurrency
    })
  )(balancesR, bankTransferAccountsR, paymentMethodsR, walletCurrencyR)
}
