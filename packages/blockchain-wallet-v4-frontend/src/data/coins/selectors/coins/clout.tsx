import React from 'react'
import { FormattedMessage } from 'react-intl'
import { lift } from 'ramda'

import { SBBalanceType } from 'blockchain-wallet-v4/src/network/api/simpleBuy/types'
import { ExtractSuccess } from 'blockchain-wallet-v4/src/remote/types'
import { CoinType } from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { generateTradingAccount } from 'data/coins/utils'
import { SwapAccountType } from 'data/components/types'

import { getTradingBalance } from '..'

// retrieves introduction text for coin on its transaction page
export const getTransactionPageHeaderText = () => (
  <FormattedMessage
    id='coins.clout.intro'
    defaultMessage='BitClout (CLOUT) is a decentralized, blockchain-based, open source social network.'
  />
)

// main selector for all CLOUT account types
// accepts a CoinAccountSelectorType config object
// NOT IMPLEMENTED FOR COIN: non-custodial accounts, imported addresses/accounts
export const getAccounts = createDeepEqualSelector(
  [
    (state, { coin }) => getTradingBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (sbBalanceR, ownProps) => {
    const transform = (sbBalance: ExtractSuccess<typeof sbBalanceR>) => {
      const { coin } = ownProps
      let accounts: SwapAccountType[] = []

      // add trading accounts if requested
      if (ownProps?.tradingAccounts) {
        accounts = accounts.concat(
          generateTradingAccount(coin as CoinType, sbBalance as SBBalanceType)
        )
      }

      return accounts
    }

    return lift(transform)(sbBalanceR)
  }
)
