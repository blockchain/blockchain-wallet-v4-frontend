import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = state => {
  const balancesR = selectors.components.simpleBuy.getSBBalances(state)
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(
    state
  )
  const cardsR = selectors.components.simpleBuy.getSBCards(state)
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const pairsR = selectors.components.simpleBuy.getSBPairs(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (
      balances: ExtractSuccess<typeof balancesR>,
      bankTransferAccounts: ExtractSuccess<typeof bankTransferAccountsR>,
      cards: ExtractSuccess<typeof cardsR>,
      eligibility: ExtractSuccess<typeof eligibilityR>,
      pairs: ExtractSuccess<typeof pairsR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>,
      supportedCoins: ExtractSuccess<typeof supportedCoinsR>,
      walletCurrency: FiatType
    ) => ({
      balances,
      bankTransferAccounts,
      cards,
      eligibility,
      pairs,
      paymentMethods,
      supportedCoins,
      walletCurrency
    })
  )(
    balancesR,
    bankTransferAccountsR,
    cardsR,
    eligibilityR,
    pairsR,
    paymentMethodsR,
    supportedCoinsR,
    walletCurrencyR
  )
}
