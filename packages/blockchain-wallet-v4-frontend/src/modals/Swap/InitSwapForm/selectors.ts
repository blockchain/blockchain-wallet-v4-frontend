import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { SWAP_ACCOUNTS_SELECTOR } from 'data/coins/model/swap'
import { getCoinAccounts } from 'data/coins/selectors'
import { RootState } from 'data/rootReducer'

export const getData = createDeepEqualSelector(
  [(state: RootState) => getCoinAccounts(state, SWAP_ACCOUNTS_SELECTOR)],
  accounts => {
    return { accounts }
  }
)
