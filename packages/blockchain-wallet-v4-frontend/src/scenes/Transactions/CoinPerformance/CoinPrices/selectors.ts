import { lift } from 'ramda'

import { ExtractSuccess, TimeRange } from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
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
