import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [selectors.modules.profile.isSilverOrAbove],
  isSilverOrAbove => ({ isSilverOrAbove })
)
