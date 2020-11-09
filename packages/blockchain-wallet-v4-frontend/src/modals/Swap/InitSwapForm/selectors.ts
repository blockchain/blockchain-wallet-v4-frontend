import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.components.swap.getActiveAccounts],
  accounts => {
    return { accounts }
  }
)
