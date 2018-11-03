import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = state =>
  createDeepEqualSelector(
    [selectors.components.layoutWallet.getBalancesTable],
    currentTab => ({
      currentTab
    })
  )(state)
