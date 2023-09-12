import { lift, map } from 'ramda'

import { TimeRange } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
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
    const cacheCoin = priceChartPreferences.coin
    const cacheTime = priceChartPreferences.time ?? TimeRange.MONTH

    const transform = (priceIndexSeriesData) => ({
      coin,
      data: map((d) => [d.timestamp * 1000, d.price], priceIndexSeriesData) as any
    })
    return {
      cache: {
        coin: cacheCoin,
        time: cacheTime
      },
      currency,
      data: lift(transform)(priceIndexSeriesDataR)
    }
  }
)
