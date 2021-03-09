import React from 'react'
import { FormattedMessage } from 'react-intl'
import { coreSelectors } from 'blockchain-wallet-v4/src'
import { SBBalanceType } from 'blockchain-wallet-v4/src/network/api/simpleBuy/types'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { ExtractSuccess } from 'blockchain-wallet-v4/src/remote/types'
import { lift, prop } from 'ramda'

import { generateCustodyAccount } from 'data/coins/utils'
import { createDeepEqualSelector } from 'services/misc'
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
        accounts = accounts.concat(
          ethMetadata.map(acc => {
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
          })
        )
      }

      // add custodial accounts if requested
      if (ownProps?.custodialAccounts) {
        accounts = accounts.concat(
          // @ts-ignore
          generateCustodyAccount(coin, sbBalance as SBBalanceType)
        )
      }

      return accounts
    }

    return lift(transform)(ethDataR, ethMetadataR, sbBalanceR)
  }
)
