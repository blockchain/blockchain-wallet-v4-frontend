import { lift } from 'ramda'

import { getBalance } from '@core/redux/data/coins/selectors'
import { createDeepEqualSelector } from '@core/utils'
import { generateSelfCustodyAccount } from 'data/coins/utils'

export const getTransactionPageHeaderText = () => null

// main selector for all SELF-CUSTODY account types
// accepts a coin string
export const getAccounts = createDeepEqualSelector(
  [
    (state, ownProps) => getBalance(ownProps.coin, state),
    (state, ownProps) => ownProps // selector config
  ],
  (balanceR, ownProps) => {
    const { coin } = ownProps

    const transform = (balance) => {
      return generateSelfCustodyAccount(coin, balance)
    }

    return lift(transform)(balanceR)
  }
)
