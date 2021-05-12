import React from 'react'
import { FormattedMessage } from 'react-intl'
import { lift } from 'ramda'

import { coreSelectors } from 'blockchain-wallet-v4/src'
import { SBBalanceType } from 'blockchain-wallet-v4/src/network/api/simpleBuy/types'
import { ExtractSuccess } from 'blockchain-wallet-v4/src/remote/types'
import { CoinType } from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { generateTradingAccount } from 'data/coins/utils'
import { SwapAccountType } from 'data/components/types'

import { getTradingBalance } from '../'

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
    coreSelectors.walletOptions.getSupportedCoins,
    (state, { coin }) => getTradingBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (supportedCoinsR, sbBalanceR, ownProps) => {
    const transform = (
      supportedCoins: ExtractSuccess<typeof supportedCoinsR>,
      sbBalance: ExtractSuccess<typeof sbBalanceR>
    ) => {
      const { coin } = ownProps
      const config = supportedCoins[coin as CoinType]
      let accounts: SwapAccountType[] = []

      // add trading accounts if requested
      if (ownProps?.tradingAccounts) {
        accounts = accounts.concat(
          generateTradingAccount(
            coin as CoinType,
            config,
            sbBalance as SBBalanceType
          )
        )
      }

      return accounts
    }

    return lift(transform)(supportedCoinsR, sbBalanceR)
  }
)
