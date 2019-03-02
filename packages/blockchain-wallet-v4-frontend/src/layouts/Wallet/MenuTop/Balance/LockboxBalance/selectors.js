import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [selectors.preferences.getTotalBalancesDropdown],
  totalBalancesDropdown => ({ totalBalancesDropdown })
)
