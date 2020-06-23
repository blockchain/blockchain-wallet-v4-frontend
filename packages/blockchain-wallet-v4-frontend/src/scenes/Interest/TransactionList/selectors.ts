import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const ratesR = selectors.components.interest.getRates(state)
  const txPages = selectors.components.interest.getInterestTransactions(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  const transform = (rates, supportedCoins, walletCurrency) => ({
    rates,
    supportedCoins,
    txPages,
    walletCurrency
  })
  return lift(transform)(ratesR, supportedCoinsR, walletCurrencyR)
}
