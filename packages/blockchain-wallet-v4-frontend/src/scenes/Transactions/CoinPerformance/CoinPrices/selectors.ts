import { lift } from 'ramda'

import { ExtractSuccess, TimeRange } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

import { OwnProps } from '.'

export const getData = createDeepEqualSelector(
  [
    (state, ownProps: OwnProps) =>
      selectors.core.data.misc.getPriceChange(ownProps.coin, TimeRange.WEEK, state),
    selectors.core.settings.getCurrency
  ],
  (priceChangeR, currencyR) => {
    const transform = (priceChange: ExtractSuccess<typeof priceChangeR>, currency) => {
      return {
        currency,
        priceChange
      }
    }

    return lift(transform)(priceChangeR, currencyR)
  }
)

export default getData
