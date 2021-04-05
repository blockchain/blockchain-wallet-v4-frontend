import { lift, map } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.settings.getCurrency,
    selectors.preferences.getPriceChart,
    selectors.components.priceChart.getCoin,
    selectors.core.data.misc.getPriceIndexSeries
  ],
  (currencyR, priceChartPreferences, coin, priceIndexSeriesDataR) => {
    const currency = currencyR.getOrElse('USD')
    const currencySymbol = Exchange.getSymbol(currency)
    const cacheCoin = priceChartPreferences.coin
    const cacheTime = priceChartPreferences.time || 'month'

    const transform = priceIndexSeriesData => ({
      data: map(
        d => [d.timestamp * 1000, d.price],
        priceIndexSeriesData
      ) as any,
      coin
    })
    return {
      data: lift(transform)(priceIndexSeriesDataR),
      currency,
      currencySymbol,
      cache: {
        coin: cacheCoin,
        time: cacheTime
      }
    }
  }
)
