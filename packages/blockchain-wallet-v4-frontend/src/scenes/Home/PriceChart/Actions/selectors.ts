import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.components.priceChart.getCoin],
  (coinTicker) => {
    const { coinfig } = window.coins[coinTicker]

    return {
      cryptoCurrency: coinfig.symbol
    }
  }
)

export default getData
