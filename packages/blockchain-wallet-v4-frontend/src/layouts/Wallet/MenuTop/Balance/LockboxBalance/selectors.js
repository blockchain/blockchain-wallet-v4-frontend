import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.preferences.getTotalBalancesDropdown],
  totalBalancesDropdown => ({ totalBalancesDropdown })
)
