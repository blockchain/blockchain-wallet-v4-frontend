import { createDeepEqualSelector } from 'services/ReselectHelper'
import { getTotalBalance as lockboxBalance } from 'components/Balances/lockbox/selectors'
import { RootState } from 'data/rootReducer'
import { getTotalBalance as totalBalance } from 'components/Balances/total/selectors'
import { getTotalBalance as walletBalance } from 'components/Balances/wallet/selectors'

export const getData = createDeepEqualSelector(
  [
    state => lockboxBalance(state as RootState),
    state => totalBalance(state as RootState),
    state => walletBalance(state as RootState),
    (state, { currentTab }) => currentTab
  ],
  (lockboxBalanceR, totalBalanceR, walletBalanceR, currentTab) => {
    if (currentTab === 'wallet') {
      return walletBalanceR
    } else if (currentTab === 'lockbox') {
      return lockboxBalanceR
    }
    return totalBalanceR
  }
)
