import React from 'react'
import { FormattedMessage } from 'react-intl'
import { lift, path, prop, propEq } from 'ramda'

import { coreSelectors } from 'blockchain-wallet-v4/src'
import { SBBalanceType } from 'blockchain-wallet-v4/src/network/api/simpleBuy/types'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { ExtractSuccess } from 'blockchain-wallet-v4/src/remote/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { generateTradingAccount } from 'data/coins/utils'
import { convertStandardToBase } from 'data/components/exchange/services'

import { getTradingBalance } from '../'

// retrieves introduction text for coin on its transaction page
export const getTransactionPageHeaderText = () => (
  <FormattedMessage
    id='coins.xlm.intro'
    defaultMessage='Stellar (XLM) connects banks, payments and you to the Stellar Payment network.'
  />
)

// main selector for all XLM account types
// accepts a CoinAccountSelectorType config object
// NOT IMPLEMENTED FOR COIN: imported addresses/accounts
export const getAccounts = createDeepEqualSelector(
  [
    coreSelectors.data.xlm.getAccounts, // non-custodial accounts
    coreSelectors.kvStore.xlm.getAccounts, // non-custodial metadata
    (state, { coin }) => getTradingBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (xlmData, xlmMetadataR, sbBalanceR, ownProps) => {
    const transform = (
      xlmMetadata,
      sbBalance: ExtractSuccess<typeof sbBalanceR>
    ) => {
      const { coin } = ownProps
      let accounts = []

      // add non-custodial accounts if requested
      if (ownProps?.nonCustodialAccounts) {
        accounts = accounts.concat(
          xlmMetadata
            .map(acc => {
              const address = prop('publicKey', acc)
              const account = prop(address, xlmData)
              const noAccount =
                path(['error', 'message'], account) === 'Not Found'
              const balance = convertStandardToBase(
                coin,
                account
                  // @ts-ignore
                  .map(coreSelectors.data.xlm.selectBalanceFromAccount)
                  .getOrElse(0)
              )
              return {
                archived: prop('archived', acc),
                baseCoin: coin,
                coin,
                label: prop('label', acc) || address,
                address,
                balance,
                noAccount,
                type: ADDRESS_TYPES.ACCOUNT
              }
            })
            .filter(propEq('archived', false))
        )
      }

      // add trading accounts if requested
      if (ownProps?.tradingAccounts) {
        accounts = accounts.concat(
          // @ts-ignore
          generateTradingAccount(coin, sbBalance as SBBalanceType)
        )
      }

      return accounts
    }

    return lift(transform)(xlmMetadataR, sbBalanceR)
  }
)
