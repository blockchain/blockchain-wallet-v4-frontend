import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { getTotalBalance as totalBalance } from 'components/Balances/total/selectors'
import { RootState } from 'data/rootReducer'

export const getData = createDeepEqualSelector(
  [state => totalBalance(state as RootState)],
  totalBalanceR => {
    return totalBalanceR
  }
)
