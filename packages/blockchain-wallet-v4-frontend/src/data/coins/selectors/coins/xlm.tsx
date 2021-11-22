import React from 'react'
import { FormattedMessage } from 'react-intl'
import { lift, path, prop, propEq } from 'ramda'

import { coreSelectors } from '@core'
import { BSBalanceType } from '@core/network/api/buySell/types'
import { ADDRESS_TYPES } from '@core/redux/payment/btc/utils'
import { ExtractSuccess } from '@core/remote/types'
import { createDeepEqualSelector } from '@core/utils'
import { generateTradingAccount } from 'data/coins/utils'
import { convertStandardToBase } from 'data/components/exchange/services'
import { SwapAccountType } from 'data/types'

import { getTradingBalance } from '..'

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
    const transform = (xlmMetadata, sbBalance: ExtractSuccess<typeof sbBalanceR>) => {
      const { coin } = ownProps
      let accounts: SwapAccountType[] = []

      // add non-custodial accounts if requested
      if (ownProps?.nonCustodialAccounts) {
        accounts = accounts.concat(
          xlmMetadata
            .map((acc) => {
              const address = prop('publicKey', acc)
              const account = prop(address, xlmData)
              const noAccount = path(['error', 'message'], account) === 'Not Found'
              const balance = convertStandardToBase(
                coin,
                account
                  // @ts-ignore
                  .map(coreSelectors.data.xlm.selectBalanceFromAccount)
                  .getOrElse(0)
              )
              return {
                address,
                archived: prop('archived', acc),
                balance,
                baseCoin: coin,
                coin,
                label: prop('label', acc) || address,
                noAccount,
                type: ADDRESS_TYPES.ACCOUNT
              }
            })
            .filter(propEq('archived', false))
        )
      }

      // add trading accounts if requested
      if (ownProps?.tradingAccounts) {
        accounts = accounts.concat(generateTradingAccount(coin, sbBalance as BSBalanceType))
      }

      return accounts
    }

    return lift(transform)(xlmMetadataR, sbBalanceR)
  }
)
