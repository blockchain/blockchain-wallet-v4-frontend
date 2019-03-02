import { createDeepEqualSelector } from 'services/ReselectHelper'
import { getCoinAndTotalBalances as lockboxBalances } from 'components/Balances/lockbox/selectors'
import { getCoinAndTotalBalances as totalBalances } from 'components/Balances/total/selectors'
import { getCoinAndTotalBalances as walletBalances } from 'components/Balances/wallet/selectors'

export const getData = createDeepEqualSelector(
  [
    lockboxBalances,
    totalBalances,
    walletBalances,
    (state, { viewType }) => viewType
  ],
  (lockboxBalancesR, totalBalancesR, walletBalancesR, viewType) => {
    if (viewType === 'Wallet') {
      return walletBalancesR
    } else if (viewType === 'Lockbox') {
      return lockboxBalancesR
    }
    return totalBalancesR
  }
)
