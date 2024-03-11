import { lift } from 'ramda'

import { ExtractSuccess, TimeRange } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'
import { PriceChartType } from 'data/components/priceChart/types'
import { RootState } from 'data/rootReducer'

export const getData = createDeepEqualSelector(
  [
    (state: RootState, priceChart: PriceChartType) =>
      selectors.core.data.misc.getPriceChange(
        priceChart.coin ?? 'BTC',
        priceChart.time ?? TimeRange.MONTH,
        state
      )
  ],
  (priceChangeR) => {
    const transform = (priceChange: ExtractSuccess<typeof priceChangeR>) => {
      return {
        priceChange
      }
    }

    return lift(transform)(priceChangeR)
  }
)
