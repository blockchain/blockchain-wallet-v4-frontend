import { createDeepEqualSelector } from 'services/misc'
import { getCoinAccounts } from 'coins/selectors'
import { SWAP_ACCOUNTS_SELECTOR } from 'coins/features/swap'

export const getData = createDeepEqualSelector(
  [(state) => getCoinAccounts(state, SWAP_ACCOUNTS_SELECTOR)],
  accounts => {
    return { accounts }
  }
)
