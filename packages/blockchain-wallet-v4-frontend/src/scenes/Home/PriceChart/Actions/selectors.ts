import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.components.priceChart.getCoin],
  (coinTicker) => {
    const { coinfig } = window.coins[coinTicker]
    const cryptoCurrency = coinfig.symbol
    const coinName = coinfig.name

    return {
      coinName,
      coinTicker,
      cryptoCurrency
    }
  }
)

export default getData
