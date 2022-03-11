import { Remote } from '@core'
import { CoinType } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { generateSelfCustodyAccount } from 'data/coins/utils'

export const getTransactionPageHeaderText = () => null

// main selector for all SELF-CUSTODY account types
// accepts a coin string
export const getAccounts = createDeepEqualSelector(
  [
    (state, ownProps) => ownProps // selector config
  ],
  (ownProps) => {
    const { coin } = ownProps

    return Remote.of(generateSelfCustodyAccount(coin as CoinType))
  }
)
