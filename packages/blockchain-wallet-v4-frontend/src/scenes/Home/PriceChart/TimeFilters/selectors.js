import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.priceChart.getTime,
    selectors.modules.profile.isSilverOrAbove
  ],
  (time, isSilverOrAbove) => ({ time, isSilverOrAbove })
)
