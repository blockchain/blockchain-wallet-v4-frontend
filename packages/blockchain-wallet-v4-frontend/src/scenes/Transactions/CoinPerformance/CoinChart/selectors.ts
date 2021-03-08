import { lift, map } from 'ramda'

import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/misc'
import { OwnProps } from '.'

export const getData = createDeepEqualSelector(
  [
    selectors.core.settings.getCurrency,
    selectors.core.data.misc.getPriceIndexSeries,
    (state, ownProps: OwnProps) =>
      selectors.core.data.misc.getPriceChange(ownProps.coin, 'week', state),
    (state, ownProps) => ownProps.coin
  ],
  (currencyR, priceIndexSeriesDataR, priceChangeR, coin) => {
    const currency = currencyR.getOrElse('USD')

    const transform = (priceIndexSeriesData, priceChange) => ({
      data: map(d => [d.timestamp * 1000, d.price], priceIndexSeriesData),
      priceChange,
      coin,
      time: 'week'
    })
    return {
      data: lift(transform)(priceIndexSeriesDataR, priceChangeR),
      currency
    }
  }
)
