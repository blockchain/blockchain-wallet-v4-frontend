import { lift, map } from 'ramda'

import { TimeRange } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

import { CoinPageContainerProps } from './types'

export const getData = createDeepEqualSelector(
  [
    selectors.core.settings.getCurrency,
    selectors.core.data.misc.getPriceIndexSeries,
    (state, ownProps: CoinPageContainerProps) =>
      selectors.core.data.misc.getPriceChange(ownProps.coin, TimeRange.WEEK, state),
    (state, ownProps) => ownProps.coin
  ],
  (currencyR, priceIndexSeriesDataR, priceChangeR, coin) => {
    const currency = currencyR.getOrElse('USD')

    const transform = (priceIndexSeriesData, priceChange) => ({
      coin,
      data: map((d) => [d.timestamp * 1000, d.price], priceIndexSeriesData) as any,
      priceChange
    })
    return {
      currency,
      data: lift(transform)(priceIndexSeriesDataR, priceChangeR)
    }
  }
)
