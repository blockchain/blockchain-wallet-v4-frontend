import { SWAP_ACCOUNTS_SELECTOR } from 'data/coins/model/swap'
import { getCoinAccounts } from 'data/coins/selectors'
import { createDeepEqualSelector } from 'services/misc'

export const getData = createDeepEqualSelector(
  [state => getCoinAccounts(state, SWAP_ACCOUNTS_SELECTOR)],
  accounts => {
    return { accounts }
  }
)
