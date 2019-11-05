import { createDeepEqualSelector } from 'services/ReselectHelper'
import { getCurrentPairAmounts } from '../selectors'
import { prop } from 'ramda'

export const getData = createDeepEqualSelector(
  [
    (state, { complementaryField }) => complementaryField,
    getCurrentPairAmounts
  ],
  (complementaryField, amountsR) => ({
    complementaryAmount: amountsR.map(prop(complementaryField))
  })
)
