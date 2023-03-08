import { lift } from 'ramda'

import { ExtractSuccess } from '@core/remote/types'
import { BSBalanceType, CoinType } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'
import { generateTradingAccount } from 'data/coins/utils'
import { SwapAccountType } from 'data/components/swap/types'

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
