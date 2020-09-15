import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.components.layoutWallet.getBalancesTable],
  currentTab => ({ currentTab })
)
