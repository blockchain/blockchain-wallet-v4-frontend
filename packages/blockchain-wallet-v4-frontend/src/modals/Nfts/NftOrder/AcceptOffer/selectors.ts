import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.components.nfts.getOpenSeaAsset, selectors.components.nfts.getOrderFlow],
  (assetR, orderflow) => {
    const transform = (
      asset: ExtractSuccess<typeof assetR>,
      fees: ExtractSuccess<typeof orderflow['fees']>,
      matchingOrder: ExtractSuccess<typeof orderflow['matchingOrder']>
    ) => ({
      asset,
      matchingOrder
    })
    return lift(transform)(assetR, orderflow.fees, orderflow.matchingOrder)
  }
)
