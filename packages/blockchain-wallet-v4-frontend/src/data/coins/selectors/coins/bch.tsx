import React from 'react'
import { FormattedMessage } from 'react-intl'
import { lift, prop, propEq } from 'ramda'

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
    id='coins.bch.intro'
    defaultMessage='Bitcoin Cash (BCH) is a fork of Bitcoin built for everyday transactions.'
  />
)

// main selector for all BCH account types
// accepts a CoinAccountSelectorType config object
export const getAccounts = createDeepEqualSelector(
  [
    coreSelectors.wallet.getHDAccounts, // non-custodial accounts
    coreSelectors.data.bch.getAddresses, // non-custodial xpub info
    coreSelectors.kvStore.bch.getAccounts, // non-custodial metadata info
    coreSelectors.common.bch.getActiveAddresses, // imported addresses
    (state, { coin }) => getTradingBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (bchAccounts, bchDataR, bchMetadataR, importedAddressesR, sbBalanceR, ownProps) => {
    const transform = (
      bchData,
      bchMetadata,
      importedAddresses,
      sbBalance: ExtractSuccess<typeof sbBalanceR>
    ) => {
      const { coin } = ownProps
      let accounts: SwapAccountType[] = []
      // add non-custodial accounts if requested
      if (ownProps?.nonCustodialAccounts) {
        accounts = accounts.concat(
          bchAccounts
            .map((acc) => {
              const index = prop('index', acc)
              // this is using hdAccount with new segwit structure
              // need to get legacy xPub from derivations object similar to btc selector
              const xpub = prop(
                'xpub',
                prop('derivations', acc).find((derr) => derr.type === 'legacy')
              )
              const data = prop(xpub, bchData)
              const metadata = bchMetadata[index]
              return {
                accountIndex: prop('index', acc),
                address: index,
                archived: prop('archived', metadata),
                balance: prop('final_balance', data),
                baseCoin: coin,
                coin,
                label: prop('label', metadata) || xpub,
                type: ADDRESS_TYPES.ACCOUNT
              }
            })
            .filter(propEq('archived', false))
        )
      }

      // add imported addresses if requested
      if (ownProps?.importedAddresses) {
        accounts = accounts.concat(
          importedAddresses.map((importedAcc) => ({
            address: importedAcc.addr,
            balance: importedAcc.info.final_balance,
            baseCoin: coin,
            coin,
            label: importedAcc.label || importedAcc.addr,
            type: ADDRESS_TYPES.LEGACY
          }))
        )
      }

      // add trading accounts if requested
      if (ownProps?.tradingAccounts) {
        accounts = accounts.concat(generateTradingAccount(coin, sbBalance as BSBalanceType))
      }

      return accounts
    }

    return lift(transform)(bchDataR, bchMetadataR, importedAddressesR, sbBalanceR)
  }
)
