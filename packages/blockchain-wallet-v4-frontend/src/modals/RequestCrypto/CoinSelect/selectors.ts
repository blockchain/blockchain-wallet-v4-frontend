import { map } from 'ramda'

import { createDeepEqualSelector } from 'services/misc'
import { selectors } from 'data'
import { SwapAccountType } from 'data/components/swap/types'

// TODO: exclude custodial, include imported, limit to only requestable coins
export const getData = createDeepEqualSelector(
  [selectors.components.swap.getActiveAccounts, (state, ownProps) => ownProps],
  (accounts, ownProps) => {
    const { selectedCoin } = ownProps?.formValues || {}
    const prunedAccounts = [] as Array<SwapAccountType>

    map(
      coin =>
        map(acct => {
          acct.type !== 'CUSTODIAL' &&
            (selectedCoin === 'ALL' ? true : acct.coin === selectedCoin) &&
            prunedAccounts.push(acct)
        }, coin),
      accounts
    )
    return prunedAccounts
  }
)
