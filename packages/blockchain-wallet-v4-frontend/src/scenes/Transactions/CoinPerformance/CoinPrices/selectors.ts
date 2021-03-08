import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { lift } from 'ramda'

import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/misc'
import { OwnProps } from '.'

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
