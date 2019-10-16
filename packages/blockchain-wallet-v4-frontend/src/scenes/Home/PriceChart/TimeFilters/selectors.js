import { isNil, path } from 'ramda'

import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.priceChart.getTime,
    selectors.modules.profile.getUserTiers
  ],
  (time, userTiers) => {
    const isSilverOrAbove = !isNil(path(['data', 'current'], userTiers))

    return {
      time,
      isSilverOrAbove
    }
  }
)
