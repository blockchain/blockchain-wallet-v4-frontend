import { lift } from 'ramda'

import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.components.nfts.getOrderFlow],
  (orderflow) => {
    const transform = (asset, offerToAccept) => ({
      asset,
      offerToAccept
    })
    return lift(transform)(orderflow.asset, orderflow.offerToAccept)
  }
)
