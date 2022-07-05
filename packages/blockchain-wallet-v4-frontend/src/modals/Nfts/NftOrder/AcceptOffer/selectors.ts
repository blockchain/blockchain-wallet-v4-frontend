import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

export const getData_LEGACY = createDeepEqualSelector(
  [selectors.components.nfts.getOrderFlow],
  (orderflow) => {
    const transform = (
      fees: ExtractSuccess<typeof orderflow['fees']>,
      matchingOrder_LEGACY: ExtractSuccess<typeof orderflow['matchingOrder_LEGACY']>
    ) => ({
      fees,
      matchingOrder_LEGACY
    })
    return lift(transform)(orderflow.fees, orderflow.matchingOrder_LEGACY)
  }
)
