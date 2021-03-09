import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { lift } from 'ramda'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { createDeepEqualSelector } from 'services/misc'
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
