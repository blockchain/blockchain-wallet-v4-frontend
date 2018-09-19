import { createDeepEqualSelector } from 'services/ReselectHelper'
import { getTotalBalance as lockboxBalance } from 'components/Balances/lockbox/selectors'
import { getTotalBalance as totalBalance } from 'components/Balances/total/selectors'
import { getTotalBalance as walletBalance } from 'components/Balances/wallet/selectors'

export const getData = (state, ownProps) =>
  createDeepEqualSelector(
    [lockboxBalance, totalBalance, walletBalance],
    (lockboxBalanceR, totalBalanceR, walletBalanceR) => {
      if (ownProps.viewType === 'Wallet') {
        return walletBalanceR
      } else if (ownProps.viewType === 'Lockbox') {
        return lockboxBalanceR
      }
      return totalBalanceR
    }
  )(state, ownProps)
