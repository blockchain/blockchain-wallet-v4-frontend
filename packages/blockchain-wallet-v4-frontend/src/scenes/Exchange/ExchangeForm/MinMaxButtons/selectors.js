import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const { getMin, getMax } = selectors.components.exchange

export const getData = createDeepEqualSelector(
  [getMin, getMax],
  (min, max) => ({ min, max })
)
