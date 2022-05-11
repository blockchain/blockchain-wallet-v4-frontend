import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.components.nfts.getOrderFlow],
  (orderflow) => {
    const transform = (
      fees: ExtractSuccess<typeof orderflow['fees']>,
      matchingOrder: ExtractSuccess<typeof orderflow['matchingOrder']>
    ) => ({
      fees,
      matchingOrder
    })
    return lift(transform)(orderflow.fees, orderflow.matchingOrder)
  }
)
