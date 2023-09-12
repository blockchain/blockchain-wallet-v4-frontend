import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.components.priceChart.getCoin],
  (coinTicker) => {
    const { coinfig } = window.coins[coinTicker]
    const cryptoCurrency = coinfig.symbol
    const coinName = coinfig.name

    return {
      coinName,
      cryptoCurrency
    }
  }
)

export default getData
