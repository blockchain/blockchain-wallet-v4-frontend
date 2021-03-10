import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = state => {
  const balancesR = selectors.components.simpleBuy.getSBBalances(state)
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(
    state
  )
  const cardsR = selectors.components.simpleBuy.getSBCards(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (
      balances: ExtractSuccess<typeof balancesR>,
      bankTransferAccounts: ExtractSuccess<typeof bankTransferAccountsR>,
      cards: ExtractSuccess<typeof cardsR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>,
      walletCurrency: FiatType
    ) => ({
      balances,
      bankTransferAccounts,
      cards,
      paymentMethods,
      walletCurrency
    })
  )(balancesR, bankTransferAccountsR, cardsR, paymentMethodsR, walletCurrencyR)
}
