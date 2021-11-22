import React from 'react'
import { FormattedMessage } from 'react-intl'
import { lift, prop } from 'ramda'

import { coreSelectors } from '@core'
import { BSBalanceType } from '@core/network/api/buySell/types'
import { ADDRESS_TYPES } from '@core/redux/payment/btc/utils'
import { ExtractSuccess } from '@core/remote/types'
import { createDeepEqualSelector } from '@core/utils'
import { generateTradingAccount } from 'data/coins/utils'
import { SwapAccountType } from 'data/types'

import { getTradingBalance } from '..'

// retrieves introduction text for coin on its transaction page
export const getTransactionPageHeaderText = () => (
  <FormattedMessage
    id='coins.eth.intro'
    defaultMessage='Ethereum (ETH) is a currency and platform for execution of decentralized smart contracts.'
  />
)

// main selector for all ETH account types
// accepts a CoinAccountSelectorType config object
// NOT IMPLEMENTED: imported addresses/accounts
export const getAccounts = createDeepEqualSelector(
  [
    coreSelectors.data.eth.getAddresses, // non-custodial accounts
    coreSelectors.kvStore.eth.getAccounts, // non-custodial metadata
    (state, { coin }) => getTradingBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (ethDataR, ethMetadataR, sbBalanceR, ownProps) => {
    const transform = (ethData, ethMetadata, sbBalance: ExtractSuccess<typeof sbBalanceR>) => {
      const { coin } = ownProps
      let accounts: SwapAccountType[] = []

      // add non-custodial accounts if requested
      if (ownProps?.nonCustodialAccounts) {
        accounts = accounts.concat(
          ethMetadata.map((acc) => {
            const address = prop('addr', acc)
            const data = prop(address, ethData)

            return {
              address,
              balance: prop('balance', data),
              baseCoin: coin,
              coin,
              label: prop('label', acc) || address,
              type: ADDRESS_TYPES.ACCOUNT
            }
          })
        )
      }

      // add trading accounts if requested
      if (ownProps?.tradingAccounts) {
        accounts = accounts.concat(generateTradingAccount(coin, sbBalance as BSBalanceType))
      }

      return accounts
    }

    return lift(transform)(ethDataR, ethMetadataR, sbBalanceR)
  }
)
