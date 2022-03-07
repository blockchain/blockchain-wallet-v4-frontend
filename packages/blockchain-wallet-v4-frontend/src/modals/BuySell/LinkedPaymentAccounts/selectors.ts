import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from '@core/types'
import { selectors } from 'data'

export const getData = (state) => {
  const balancesR = selectors.components.buySell.getBSBalances(state)
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(state)
  const cardsR = selectors.components.buySell.getBSCards(state)
  const paymentMethodsR = selectors.components.buySell.getBSPaymentMethods(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)
  const applePayEnabledR = selectors.core.walletOptions.getApplePayAsNewPaymentMethod(state)
  const isInternalTesterR = selectors.modules.profile.isInternalTester(state)

  return lift(
    (
      applePayEnabled: Boolean,
      balances: ExtractSuccess<typeof balancesR>,
      bankTransferAccounts: ExtractSuccess<typeof bankTransferAccountsR>,
      cards: ExtractSuccess<typeof cardsR>,
      isInternalTester: ExtractSuccess<typeof isInternalTesterR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>,
      walletCurrency: FiatType
    ) => ({
      applePayEnabled,
      balances,
      bankTransferAccounts,
      cards,
      isInternalTester,
      paymentMethods,
      walletCurrency
    })
  )(
    applePayEnabledR,
    balancesR,
    bankTransferAccountsR,
    cardsR,
    isInternalTesterR,
    paymentMethodsR,
    walletCurrencyR
  )
}
