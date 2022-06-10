import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.components.nfts.getOpenSeaAsset, selectors.components.nfts.getOrderFlow],
  (assetR, orderFlow) => {
    const transform = (
      asset: ExtractSuccess<typeof assetR>,
      fees: ExtractSuccess<typeof orderFlow['fees']>,
      matchingOrder: ExtractSuccess<typeof orderFlow['matchingOrder']>
    ) => ({
      asset,
      fees,
      matchingOrder
    })
    return lift(transform)(assetR, orderFlow.fees, orderFlow.matchingOrder)
  }
)
