import { createDeepEqualSelector } from 'services/ReselectHelper'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

import { ExtractSuccess } from 'core/types'
import { OwnProps } from '.'

export const getData = createDeepEqualSelector(
  [
    (state: RootState, ownProps: OwnProps) =>
      selectors.core.data.misc.getPriceChange(
        ownProps.priceChart.coin || 'BTC',
        ownProps.priceChart.time || 'month',
        state
      )
  ],
  priceChangeR => {
    const transform = (priceChange: ExtractSuccess<typeof priceChangeR>) => {
      return {
        priceChange
      }
    }

    return lift(transform)(priceChangeR)
  }
)
