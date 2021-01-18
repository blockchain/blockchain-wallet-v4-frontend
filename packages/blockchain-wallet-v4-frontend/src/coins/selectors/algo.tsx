import { FormattedMessage } from 'react-intl'
import { lift } from 'ramda'
import React from 'react'

import { createDeepEqualSelector } from 'services/misc'
import { ExtractSuccess } from 'core/remote/types'
import { generateCustodyAccount } from 'coins/utils'
import { SBBalanceType } from 'core/network/api/simpleBuy/types'

import { getCustodialBalance } from './'

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

      // add custodial accounts if requested
      if (ownProps?.custodialAccounts) {
        // @ts-ignore
        accounts = accounts.concat(generateCustodyAccount(coin, sbBalance as SBBalanceType))
      }

      return accounts
    }

    return lift(transform)(sbBalanceR)
  }
)
