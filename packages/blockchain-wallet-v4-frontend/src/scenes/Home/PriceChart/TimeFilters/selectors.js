import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.components.priceChart.getTime,
    selectors.modules.profile.isSilverOrAbove
  ],
  (time, isSilverOrAbove) => ({ time, isSilverOrAbove })
)
