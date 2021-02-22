import { FormattedMessage } from 'react-intl'
import { lift, prop } from 'ramda'
import React from 'react'

import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { coreSelectors } from 'blockchain-wallet-v4/src'
import { createDeepEqualSelector } from 'services/misc'
import { ExtractSuccess } from 'blockchain-wallet-v4/src/remote/types'
import { generateCustodyAccount } from 'data/coins/utils'
import { SBBalanceType } from 'core/network/api/simpleBuy/types'

import { getCustodialBalance } from '../'

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
    (state, { coin }) => getCustodialBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (ethDataR, ethMetadataR, sbBalanceR, ownProps) => {
    const transform = (
      ethData,
      ethMetadata,
      sbBalance: ExtractSuccess<typeof sbBalanceR>
    ) => {
      const { coin } = ownProps
      let accounts = []

      // add non-custodial accounts if requested
      if (ownProps?.nonCustodialAccounts) {
        accounts = accounts.concat(ethMetadata
          .map(acc => {
            const address = prop('addr', acc)
            const data = prop(address, ethData)

            return {
              baseCoin: coin,
              coin,
              label: prop('label', acc) || address,
              address,
              balance: prop('balance', data),
              type: ADDRESS_TYPES.ACCOUNT
            }
          }))
      }

      // add custodial accounts if requested
      if (ownProps?.custodialAccounts) {
        // @ts-ignore
        accounts = accounts.concat(generateCustodyAccount(coin, sbBalance as SBBalanceType))
      }

      return accounts
    }

    return lift(transform)(ethDataR, ethMetadataR, sbBalanceR)
  }
)