import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.components.nfts.getOrderFlow],
  (orderflow: ReturnType<typeof selectors.components.nfts.getOrderFlow>) => {
    const transform = (
      asset: ExtractSuccess<typeof orderflow['asset']>,
      fees: ExtractSuccess<typeof orderflow['fees']>,
      matchingOrder: ExtractSuccess<typeof orderflow['matchingOrder']>
    ) => ({
      asset,
      matchingOrder
    })
    return lift(transform)(orderflow.asset, orderflow.fees, orderflow.matchingOrder)
  }
)
