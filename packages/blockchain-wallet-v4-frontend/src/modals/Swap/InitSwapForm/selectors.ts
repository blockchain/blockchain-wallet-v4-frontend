import { createDeepEqualSelector } from 'services/misc'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.components.swap.getActiveAccounts],
  accounts => {
    return { accounts }
  }
)
