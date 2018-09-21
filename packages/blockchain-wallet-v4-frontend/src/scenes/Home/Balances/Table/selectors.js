import { createDeepEqualSelector } from 'services/ReselectHelper'
import { getCoinAndTotalBalances as lockboxBalances } from 'components/Balances/lockbox/selectors'
import { getCoinAndTotalBalances as totalBalances } from 'components/Balances/total/selectors'
import { getCoinAndTotalBalances as walletBalances } from 'components/Balances/wallet/selectors'

export const getData = (state, ownProps) =>
  createDeepEqualSelector(
    [lockboxBalances, totalBalances, walletBalances],
    (lockboxBalancesR, totalBalancesR, walletBalancesR) => {
      if (ownProps.viewType === 'Wallet') {
        return walletBalancesR
      } else if (ownProps.viewType === 'Lockbox') {
        return lockboxBalancesR
      }
      return totalBalancesR
    }
  )(state, ownProps)
