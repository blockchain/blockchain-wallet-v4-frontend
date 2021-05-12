import React from 'react'
import { FormattedMessage } from 'react-intl'
import { lift, prop, propEq } from 'ramda'

import { coreSelectors } from 'blockchain-wallet-v4/src'
import { SBBalanceType } from 'blockchain-wallet-v4/src/network/api/simpleBuy/types'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { ExtractSuccess } from 'blockchain-wallet-v4/src/remote/types'
import { CoinType } from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { generateTradingAccount } from 'data/coins/utils'
import { SwapAccountType } from 'data/components/types'

import { getTradingBalance } from '../'

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
    coreSelectors.walletOptions.getSupportedCoins,
    (state, { coin }) => getTradingBalance(coin, state), // custodial accounts
    (state, ownProps) => ownProps // selector config
  ],
  (
    bchAccounts,
    bchDataR,
    bchMetadataR,
    importedAddressesR,
    supportedCoinsR,
    sbBalanceR,
    ownProps
  ) => {
    const transform = (
      bchData,
      bchMetadata,
      importedAddresses,
      supportedCoins: ExtractSuccess<typeof supportedCoinsR>,
      sbBalance: ExtractSuccess<typeof sbBalanceR>
    ) => {
      const { coin } = ownProps
      const config = supportedCoins[coin as CoinType]
      let accounts: SwapAccountType[] = []
      // add non-custodial accounts if requested
      if (ownProps?.nonCustodialAccounts) {
        accounts = accounts.concat(
          bchAccounts
            .map(acc => {
              const index = prop('index', acc)
              // this is using hdAccount with new segwit structure
              // need to get legacy xPub from derivations object similar to btc selector
              // TODO: SEGWIT remove w/ DEPRECATED_V3
              const xpub = acc.derivations
                ? prop(
                    'xpub',
                    prop('derivations', acc).find(
                      derr => derr.type === 'legacy'
                    )
                  )
                : acc.xpub
              const data = prop(xpub, bchData)
              const metadata = bchMetadata[index]
              return {
                accountIndex: prop('index', acc),
                address: index,
                archived: prop('archived', metadata),
                balance: prop('final_balance', data),
                baseCoin: coin,
                config,
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
          importedAddresses.map(importedAcc => ({
            address: importedAcc.addr,
            balance: importedAcc.final_balance,
            baseCoin: coin,
            config,
            coin,
            label: importedAcc.label || importedAcc.addr,
            type: ADDRESS_TYPES.LEGACY
          }))
        )
      }

      // add trading accounts if requested
      if (ownProps?.tradingAccounts) {
        accounts = accounts.concat(
          generateTradingAccount(coin, config, sbBalance as SBBalanceType)
        )
      }

      return accounts
    }

    return lift(transform)(
      bchDataR,
      bchMetadataR,
      importedAddressesR,
      supportedCoinsR,
      sbBalanceR
    )
  }
)
