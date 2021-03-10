import { lift } from 'ramda'

import {
  ExtractSuccess,
  FiatType,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = state => {
  const ratesR = selectors.components.interest.getRates(state)
  const txPages = selectors.components.interest.getInterestTransactions(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  const transform = (
    rates: ExtractSuccess<typeof ratesR>,
    supportedCoins: SupportedWalletCurrenciesType,
    walletCurrency: FiatType
  ) => ({
    rates,
    supportedCoins,
    txPages,
    walletCurrency
  })
  return lift(transform)(ratesR, supportedCoinsR, walletCurrencyR)
}
