import { map } from 'ramda'

import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { REQUEST_ACCOUNTS_SELECTOR } from 'data/coins/model/request'
import { getCoinAccounts } from 'data/coins/selectors'
import { CoinAccountSelectorType } from 'data/coins/types'
import { SwapAccountType } from 'data/components/swap/types'

import { Props as OwnProps } from '..'

export const getData = createDeepEqualSelector(
  [
    (state, ownProps: OwnProps) =>
      getCoinAccounts(state, {
        coins: ownProps.sendableCoins,
        ...REQUEST_ACCOUNTS_SELECTOR
      } as CoinAccountSelectorType),
    (state, ownProps) => ({ ownProps, state })
  ],
  (accounts, { ownProps }) => {
    const { selectedCoin } = ownProps?.formValues || {}
    const prunedAccounts = [] as Array<SwapAccountType>

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

    return { accounts: prunedAccounts }
  }
)
export default getData
