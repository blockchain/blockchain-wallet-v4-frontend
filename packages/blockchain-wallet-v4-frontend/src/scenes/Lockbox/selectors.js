import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [selectors.components.lockbox.getXpubs],
  xpubs => {
    return xpubs
  }
)
