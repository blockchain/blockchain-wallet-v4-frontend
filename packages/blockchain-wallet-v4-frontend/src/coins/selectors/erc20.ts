import { lift, prop, toLower } from 'ramda'

import { ADDRESS_TYPES } from 'core/redux/payment/btc/utils'
import { CoinType } from 'core/types'
import { coreSelectors } from 'core'
import { createDeepEqualSelector } from 'services/misc'
import { ExtractSuccess } from 'core/remote/types'
import { generateCustodyAccount } from 'coins/utils'
import { SBBalanceType } from 'core/network/api/simpleBuy/types'

import { getCustodialBalance } from './'

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