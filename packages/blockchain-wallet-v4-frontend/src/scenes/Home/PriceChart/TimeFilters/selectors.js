import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/misc'

export const getData = createDeepEqualSelector(
  [selectors.components.priceChart.getTime],
  time => ({
    time
  })
)
