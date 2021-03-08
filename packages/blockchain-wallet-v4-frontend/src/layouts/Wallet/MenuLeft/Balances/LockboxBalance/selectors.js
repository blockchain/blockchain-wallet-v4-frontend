import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/misc'

export const getData = createDeepEqualSelector(
  [selectors.preferences.getTotalBalancesDropdown],
  totalBalancesDropdown => ({ totalBalancesDropdown })
)
