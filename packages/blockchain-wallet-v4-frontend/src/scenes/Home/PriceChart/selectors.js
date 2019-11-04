import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.modules.profile.isSilverOrAbove],
  isSilverOrAbove => ({ isSilverOrAbove })
)
