import { lift } from 'ramda'

import { ExtractSuccess, TimeRange } from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { OwnProps } from '.'

export const getData = createDeepEqualSelector(
  [
    (state: RootState, ownProps: OwnProps) =>
      selectors.core.data.misc.getPriceChange(
        ownProps.priceChart.coin || 'BTC',
        ownProps.priceChart.time || TimeRange.MONTH,
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
