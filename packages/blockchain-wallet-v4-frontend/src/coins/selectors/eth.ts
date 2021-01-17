import { lift, prop } from 'ramda'

import { ADDRESS_TYPES } from 'core/redux/payment/btc/utils'
import { coreSelectors } from 'core'
import { createDeepEqualSelector } from 'services/misc'
import { ExtractSuccess } from 'core/remote/types'
import { generateCustodyAccount } from 'coins/utils'
import { SBBalanceType } from 'core/network/api/simpleBuy/types'

import { getCustodialBalance } from './'

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