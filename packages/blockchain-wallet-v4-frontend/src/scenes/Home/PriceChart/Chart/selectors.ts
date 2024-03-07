import { lift, map } from 'ramda'

import { TimeRange } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.settings.getCurrency,
    selectors.components.priceChart.getTime,
    selectors.components.priceChart.getCoin,
    selectors.core.data.misc.getPriceIndexSeries
  ],
  (currencyR, time, coin, priceIndexSeriesDataR) => {
    const currency = currencyR.getOrElse('USD')

    const transform = (priceIndexSeriesData) => ({
      coin,
      data: map((d) => [d.timestamp * 1000, d.price], priceIndexSeriesData) as any
    })
    return {
      cache: {
        coin,
        time: time ?? TimeRange.MONTH
      },
      currency,
      data: lift(transform)(priceIndexSeriesDataR)
    }
  }
)
