import React from 'react'
import { FormattedMessage } from 'react-intl'
import { lift } from 'ramda'

import { coreSelectors } from 'blockchain-wallet-v4/src'
import { SBBalanceType } from 'blockchain-wallet-v4/src/network/api/simpleBuy/types'
import { ExtractSuccess } from 'blockchain-wallet-v4/src/remote/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { generateTradingAccount } from 'data/coins/utils'
import { SwapAccountType, SwapBaseCounterTypes } from 'data/components/types'

import { getTradingBalance } from '..'

// retrieves introduction text for coin on its transaction page
export const getTransactionPageHeaderText = (coin) => {
  switch (coin) {
    case 'AAVE':
      return (
        <FormattedMessage
          id='coins.aave.intro'
          defaultMessage='Aave is a decentralized finance protocol that allows people to lend and borrow crypto.'
        />
      )
    case 'PAX':
      return (
        <FormattedMessage
          id='coins.pax.intro1'
          defaultMessage='Paxos Standard (PAX) is a stablecoin backed by the U.S. dollar.'
        />
      )
    case 'USDT':
      return (
        <FormattedMessage
          id='coins.usdt.intro'
          defaultMessage='Tether (USDT) is a stablecoin backed by the U.S. dollar.'
        />
      )
    case 'WDGLD':
      return (
        <FormattedMessage
          id='coins.wdgld.intro'
          defaultMessage='Wrapped Digital Gold (wDGLD) is a gold-backed token built with the power and flexibility of Ethereum.'
        />
      )
    case 'YFI':
      return (
        <FormattedMessage
          id='coins.yfi.intro'
          defaultMessage='Yearn.Finance (YFI) is a portal to DeFi and yield-generating products in the Ethereum ecosystem.'
        />
      )
    default:
      return null
  }
}

// main selector for all ERC20 account types
// accepts a CoinAccountSelectorType config object
// NOT IMPLEMENTED: imported addresses/accounts
export const getAccounts = createDeepEqualSelector(
  [
    coreSelectors.kvStore.eth.getDefaultAddress,
    (state, { coin }) => coreSelectors.data.eth.getErc20Balance(state, coin), // non-custodial metadata
    (state, { coin }) => getTradingBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (ethAddressR, erc20BalanceR, sbBalanceR, ownProps) => {
    const transform = (ethAddress, erc20Balance, sbBalance: ExtractSuccess<typeof sbBalanceR>) => {
      const { coin } = ownProps
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
      if (ownProps?.tradingAccounts) {
        accounts = accounts.concat(generateTradingAccount(coin, sbBalance as SBBalanceType))
      }
      return accounts
    }

    return lift(transform)(ethAddressR, erc20BalanceR, sbBalanceR)
  }
)
