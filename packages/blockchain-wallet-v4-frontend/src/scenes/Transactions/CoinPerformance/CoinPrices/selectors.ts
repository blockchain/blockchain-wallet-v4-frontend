import { lift } from 'ramda'

import { createDeepEqualSelector } from 'services/ReselectHelper'
import { ExtractSuccess } from 'core/types'
import { OwnProps } from '.'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    (state, ownProps: OwnProps) =>
      selectors.core.data.misc.getPriceChange(
        ownProps.coinModel.coinCode,
        'week',
        state
      ),
    selectors.core.settings.getCurrency
  ],
  (priceChangeR, currencyR) => {
    const transform = (
      priceChange: ExtractSuccess<typeof priceChangeR>,
      currency
    ) => {
      return {
        currency,
        priceChange
      }
    }

    return lift(transform)(priceChangeR, currencyR)
  }
)
