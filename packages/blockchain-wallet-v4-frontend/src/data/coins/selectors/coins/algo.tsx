import React from 'react'
import { FormattedMessage } from 'react-intl'
import { SBBalanceType } from 'blockchain-wallet-v4/src/network/api/simpleBuy/types'
import { ExtractSuccess } from 'blockchain-wallet-v4/src/remote/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { lift } from 'ramda'

import { generateCustodyAccount } from 'data/coins/utils'
import { getCustodialBalance } from '../'

// retrieves introduction text for coin on its transaction page
export const getTransactionPageHeaderText = () => (
  <FormattedMessage
    id='coins.algo.intro'
    defaultMessage='Algorand (ALGO) is a public blockchain based on a pure proof-of-stake consensus protocol.'
  />
)

// main selector for all ALGO account types
// accepts a CoinAccountSelectorType config object
// NOT IMPLEMENTED FOR COIN: non-custodial accounts, imported addresses/accounts
export const getAccounts = createDeepEqualSelector(
  [
    (state, { coin }) => getCustodialBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (sbBalanceR, ownProps) => {
    const transform = (sbBalance: ExtractSuccess<typeof sbBalanceR>) => {
      const { coin } = ownProps
      let accounts = []

      // add trading accounts if requested
      if (ownProps?.tradingAccounts) {
        accounts = accounts.concat(
          // @ts-ignore
          generateCustodyAccount(coin, sbBalance as SBBalanceType)
        )
      }

      return accounts
    }

    return lift(transform)(sbBalanceR)
  }
)
