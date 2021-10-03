import { lift, map } from 'ramda'

import { TimeRange } from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

import { OwnProps } from '.'

export const getData = createDeepEqualSelector(
  [
    selectors.core.settings.getCurrency,
    selectors.core.data.misc.getPriceIndexSeries,
    (state, ownProps: OwnProps) =>
      selectors.core.data.misc.getPriceChange(
        ownProps.coin,
        TimeRange.WEEK,
        state
      ),
    (state, ownProps) => ownProps.coin
  ],
  (currencyR, priceIndexSeriesDataR, priceChangeR, coin) => {
    const currency = currencyR.getOrElse('USD')

    const transform = (priceIndexSeriesData, priceChange) => ({
      data: map(
        d => [d.timestamp * 1000, d.price],
        priceIndexSeriesData
      ) as any,
      priceChange,
      coin
    })
    return {
      data: lift(transform)(priceIndexSeriesDataR, priceChangeR),
      currency
    }
  }
)
