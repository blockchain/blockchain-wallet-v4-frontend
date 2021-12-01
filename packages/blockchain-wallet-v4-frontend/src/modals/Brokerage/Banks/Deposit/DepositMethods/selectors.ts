import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const balancesR = selectors.components.buySell.getBSBalances(state)
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(state)
  // TODO: Move payment methods reducer to brokerage
  const paymentMethodsR = selectors.components.buySell.getBSPaymentMethods(state)
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
