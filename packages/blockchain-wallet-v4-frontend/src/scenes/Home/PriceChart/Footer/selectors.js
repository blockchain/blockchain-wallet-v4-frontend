import { createDeepEqualSelector } from 'services/ReselectHelper'
import { path } from 'ramda'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.components.priceChart.getCoin,
    selectors.core.walletOptions.getSupportedCoins
  ],
  (coinTicker, supportedCoins) => {
    const cryptoCurrency = path(
      ['data', coinTicker, 'coinCode'],
      supportedCoins
    )
    const coinName = path(['data', coinTicker, 'displayName'], supportedCoins)

    return {
      cryptoCurrency,
      coinTicker,
      coinName
    }
  }
)
