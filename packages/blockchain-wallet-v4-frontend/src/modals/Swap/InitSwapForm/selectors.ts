import { createDeepEqualSelector } from 'services/misc'
import { getCoinAccounts } from 'data/coins/selectors'
import { SWAP_ACCOUNTS_SELECTOR } from 'data/coins/model/swap'

export const getData = createDeepEqualSelector(
  [(state) => getCoinAccounts(state, SWAP_ACCOUNTS_SELECTOR)],
  accounts => {
    return { accounts }
  }
)
