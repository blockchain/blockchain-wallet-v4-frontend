import { FormattedMessage } from 'react-intl'
import { lift, prop, toLower } from 'ramda'
import React from 'react'

import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { CoinType } from 'blockchain-wallet-v4/src/types'
import { coreSelectors } from 'blockchain-wallet-v4/src'
import { createDeepEqualSelector } from 'services/misc'
import { ExtractSuccess } from 'blockchain-wallet-v4/src/remote/types'
import { generateCustodyAccount } from 'coins/utils'
import { SBBalanceType } from 'core/network/api/simpleBuy/types'

import { getCustodialBalance } from './'

// retrieves introduction text for coin on its transaction page
export const getTransactionPageHeaderText = (coin) => {
  switch (coin) {
    case 'PAX':
    case 'USDD':
    case 'USD-D':
      return (
        <FormattedMessage
          id='coins.pax.intro'
          defaultMessage='USD Digital (USD-D) is a stablecoin backed by the U.S. dollar.'
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
    default:
      return <span>Coin introduction missing!</span>
  }
}


// main selector for all ERC20 account types
// accepts a CoinAccountSelectorType config object
// NOT IMPLEMENTED: imported addresses/accounts
export const getAccounts = createDeepEqualSelector(
  [
    coreSelectors.data.eth.getDefaultAddress,
    (state, { coin }) => coreSelectors.kvStore.eth.getErc20Account(state, toLower(coin) as CoinType), // non-custodial accounts
    (state, { coin }) => coreSelectors.data.eth.getErc20Balance(state, toLower(coin) as CoinType), // non-custodial metadata
    (state, { coin }) => getCustodialBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (ethAddressR, erc20AccountR, erc20BalanceR, sbBalanceR, ownProps) => {
    const transform = (
      ethAddress,
      erc20Account,
      erc20Balance,
      sbBalance: ExtractSuccess<typeof sbBalanceR>
    ) => {
      const { coin } = ownProps
      let accounts = []

      // add non-custodial accounts if requested
      if (ownProps?.nonCustodialAccounts) {
        // @ts-ignore
        accounts = accounts.concat([{
          baseCoin: 'ETH',
          coin,
          label: prop('label', erc20Account),
          address: ethAddress,
          balance: erc20Balance,
          type: ADDRESS_TYPES.ACCOUNT
        }])
      }

      // add custodial accounts if requested
      if (ownProps?.custodialAccounts) {
        // @ts-ignore
        accounts = accounts.concat(generateCustodyAccount(coin, sbBalance as SBBalanceType))
      }
      return accounts
    }

    return lift(transform)(
      ethAddressR,
      erc20AccountR,
      erc20BalanceR,
      sbBalanceR
    )
  }
)