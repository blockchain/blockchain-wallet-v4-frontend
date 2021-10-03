import { map } from 'ramda'

import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'
import { REQUEST_ACCOUNTS_SELECTOR } from 'data/coins/model/request'
import { getCoinAccounts } from 'data/coins/selectors'
import { CoinAccountSelectorType } from 'data/coins/types'
import { SwapAccountType } from 'data/components/swap/types'

export const getData = createDeepEqualSelector(
  [
    (state, ownProps) =>
      getCoinAccounts(state, {
        coins: ownProps.requestableCoins,
        ...REQUEST_ACCOUNTS_SELECTOR
      } as CoinAccountSelectorType),
    selectors.modules.profile.isSilverOrAbove,
    (state, ownProps) => ({ ownProps, state })
  ],
  (accounts, isSilverOrAbove, { ownProps }) => {
    const { selectedCoin } = ownProps?.formValues || {}
    const prunedAccounts = [] as Array<SwapAccountType>
    const isAtLeastTier1 = isSilverOrAbove

    // @ts-ignore
    map(
      (coin) =>
        map((acct: any) => {
          if (selectedCoin === 'ALL' ? true : acct.coin === selectedCoin) {
            prunedAccounts.push(acct)
          }
        }, coin),
      accounts
    )

    return { accounts: prunedAccounts, isAtLeastTier1 }
  }
)
export default getData
