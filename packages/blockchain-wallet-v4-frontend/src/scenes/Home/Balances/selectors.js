import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.components.layoutWallet.getBalancesTable],
  currentTab => ({ currentTab })
)
