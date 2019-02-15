import { prop } from 'ramda'

import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'
import { getCurrentPairAmounts } from '../selectors'

const { getSourceFee } = selectors.components.exchange

export const getData = createDeepEqualSelector(
  [getSourceFee, getCurrentPairAmounts],
  (sourceFee, amountsR) => ({
    sourceFee,
    sourceAmount: amountsR.map(prop('sourceAmount')),
    targetAmount: amountsR.map(prop('targetAmount')),
    targetFiat: amountsR.map(prop('targetFiat'))
  })
)
