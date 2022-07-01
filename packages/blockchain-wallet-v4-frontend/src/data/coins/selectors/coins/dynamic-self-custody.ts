import { lift } from 'ramda'

import { getBalance } from '@core/redux/data/coins/selectors'
import { BSBalanceType } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'
import { generateSelfCustodyAccount, generateTradingAccount } from 'data/coins/utils'
import { SwapAccountType } from 'data/types'

export const getTransactionPageHeaderText = () => null

// main selector for all DYNAMIC-SELF-CUSTODY account types
// accepts a coin string
export const getAccounts = createDeepEqualSelector(
  [
    (state, ownProps) => getBalance(ownProps.coin, state),
    (state, { coin }) => selectors.balances.getCoinTradingBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (balanceR, sbBalanceR, ownProps) => {
    const { coin } = ownProps
    const { coinfig } = window.coins[coin]
    let accounts: SwapAccountType[] = []

    const transform = (balance, sbBalance) => {
      accounts = accounts.concat(generateSelfCustodyAccount(coin, balance))

      // add trading accounts if requested
      if (ownProps?.tradingAccounts && coinfig.products.includes('CustodialWalletBalance')) {
        accounts = accounts.concat(generateTradingAccount(coin, sbBalance as BSBalanceType))
      }
      return accounts
    }

    return lift(transform)(balanceR, sbBalanceR)
  }
)
