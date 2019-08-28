import { prop } from 'ramda'

import { createDeepEqualSelector } from 'services/ReselectHelper'
import { getCurrentPairAmounts } from '../selectors'

export const getData = createDeepEqualSelector(
  [
    (state, { complementaryField }) => complementaryField,
    getCurrentPairAmounts
  ],
  (complementaryField, amountsR) => ({
    complementaryAmount: amountsR.map(prop(complementaryField))
  })
)
