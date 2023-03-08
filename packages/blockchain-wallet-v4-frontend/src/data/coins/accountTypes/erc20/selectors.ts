import { lift } from 'ramda'

import { coreSelectors } from '@core'
import { BSBalanceType } from '@core/network/api/buySell/types'
import { ExtractSuccess } from '@core/remote/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'
import { generateTradingAccount } from 'data/coins/utils'
import { SwapAccountType, SwapBaseCounterTypes } from 'data/components/swap/types'

export const getAccounts = createDeepEqualSelector(
  [
    coreSelectors.kvStore.eth.getDefaultAddress,
    (state, { coin }) => selectors.balances.getCoinNonCustodialBalance(coin)(state), // non-custodial metadata
    (state, { coin }) => selectors.balances.getCoinTradingBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (ethAddressR, erc20BalanceR, sbBalanceR, ownProps) => {
    const transform = (ethAddress, erc20Balance, sbBalance: ExtractSuccess<typeof sbBalanceR>) => {
      const { coin } = ownProps
      const { coinfig } = window.coins[coin]
      let accounts: SwapAccountType[] = []

      // add non-custodial accounts if requested
      if (ownProps?.nonCustodialAccounts) {
        accounts = accounts.concat([
          {
            address: ethAddress,
            balance: erc20Balance,
            baseCoin: 'ETH',
            coin,
            label: 'Private Key Wallet',
            type: SwapBaseCounterTypes.ACCOUNT
          }
        ])
      }

      // add trading accounts if requested
      if (ownProps?.tradingAccounts && coinfig.products.includes('CustodialWalletBalance')) {
        accounts = accounts.concat(generateTradingAccount(coin, sbBalance as BSBalanceType))
      }
      return accounts
    }

    return lift(transform)(ethAddressR, erc20BalanceR, sbBalanceR)
  }
)
