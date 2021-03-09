import { Exchange } from 'blockchain-wallet-v4/src'
import { lift, map } from 'ramda'

import { selectors } from 'data'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'

export const getData = createDeepEqualSelector(
  [
    selectors.core.settings.getCurrency,
    selectors.preferences.getPriceChart,
    selectors.components.priceChart.getCoin,
    selectors.components.priceChart.getTime,
    selectors.core.data.misc.getPriceIndexSeries
  ],
  (currencyR, priceChartPreferences, coin, time, priceIndexSeriesDataR) => {
    const currency = currencyR.getOrElse('USD')
    const currencySymbol = Exchange.getSymbol(currency)
    // @ts-ignore
    const cacheCoin = priceChartPreferences.coin
    // @ts-ignore
    const cacheTime = priceChartPreferences.time || 'month'

    const transform = priceIndexSeriesData => ({
      data: map(d => [d.timestamp * 1000, d.price], priceIndexSeriesData),
      coin,
      time
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
