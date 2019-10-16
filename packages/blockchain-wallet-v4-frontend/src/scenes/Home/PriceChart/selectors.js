import { isNil, path } from 'ramda'

import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [selectors.modules.profile.getUserTiers],
  userTiers => {
    const isSilverOrAbove = !isNil(path(['data', 'current'], userTiers))

    return {
      isSilverOrAbove
    }
  }
)
