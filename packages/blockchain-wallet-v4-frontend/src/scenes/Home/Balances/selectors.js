import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getBalancesTable,
    selectors.modules.profile.isSilverOrAbove
  ],
  (currentTab, isSilverOrAbove) => ({ currentTab, isSilverOrAbove })
)
