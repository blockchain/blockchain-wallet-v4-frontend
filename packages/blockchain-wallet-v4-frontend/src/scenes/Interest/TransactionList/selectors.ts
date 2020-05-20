import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const btcRateR = selectors.core.data.btc.getRates(state)
  const coin = selectors.components.interest.getCoinType(state)
  const txPages = selectors.components.interest.getInterestTransactions(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  const transform = (btcRates, supportedCoins, walletCurrency) => ({
    btcRates,
    coin,
    supportedCoins,
    txPages,
    walletCurrency
  })
  return lift(transform)(btcRateR, supportedCoinsR, walletCurrencyR)
}
