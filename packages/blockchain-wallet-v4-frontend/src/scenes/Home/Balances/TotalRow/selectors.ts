import { createDeepEqualSelector } from 'services/ReselectHelper'
import { getCoinAndTotalBalances as lockboxBalances } from 'components/Balances/lockbox/selectors'
import { getCoinAndTotalBalances as totalBalances } from 'components/Balances/total/selectors'
import { getCoinAndTotalBalances as walletBalances } from 'components/Balances/wallet/selectors'

export const getData = createDeepEqualSelector(
  [
    state => lockboxBalances(state),
    state => totalBalances(state),
    state => walletBalances(state),
    (state, { viewType }) => viewType
  ],
  (lockboxBalancesR, totalBalancesR, walletBalancesR, viewType) => {
    if (viewType === 'Wallet') {
      return walletBalancesR
    } else if (viewType === 'Hardware') {
      return lockboxBalancesR
    }
    return totalBalancesR
  }
)
