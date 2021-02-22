import { createDeepEqualSelector } from 'services/misc'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.preferences.getTotalBalancesDropdown],
  totalBalancesDropdown => ({ totalBalancesDropdown })
)
