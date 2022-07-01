import { lift } from 'ramda'

import { BSBalanceType } from '@core/network/api/buySell/types'
import { ExtractSuccess } from '@core/remote/types'
import { CoinType } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'
import { generateTradingAccount } from 'data/coins/utils'
import { SwapAccountType } from 'data/types'

// retrieves introduction text for coin on its transaction page
export const getTransactionPageHeaderText = () => null

// main selector for all CUSTODIAL account types
// accepts a CoinAccountSelectorType config object
// NOT IMPLEMENTED FOR COIN: non-custodial accounts, imported addresses/accounts
export const getAccounts = createDeepEqualSelector(
  [
    (state, { coin }) => selectors.balances.getCoinTradingBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (sbBalanceR, ownProps) => {
    const transform = (sbBalance: ExtractSuccess<typeof sbBalanceR>) => {
      const { coin } = ownProps
      const { coinfig } = window.coins[coin]
      let accounts: SwapAccountType[] = []

      // add trading accounts if requested
      if (ownProps?.tradingAccounts && coinfig.products.includes('CustodialWalletBalance')) {
        accounts = accounts.concat(
          generateTradingAccount(coin as CoinType, sbBalance as BSBalanceType)
        )
      }

      return accounts
    }

    return lift(transform)(sbBalanceR)
  }
)
