import { map } from 'ramda'

import { createDeepEqualSelector } from 'services/misc'
import { selectors } from 'data'
import { SwapAccountType } from 'data/components/swap/types'

// TODO: include imported address
export const getData = createDeepEqualSelector(
  [
    selectors.components.swap.getActiveAccounts,
    selectors.core.common.btc.getActiveAddresses,
    selectors.core.walletOptions.getAllCoinAvailabilities,
    (state, ownProps) => ownProps
  ],
  (accounts, importedAddressesR, coinAvailabilitiesR, ownProps) => {
    const { selectedCoin } = ownProps?.formValues || {}
    const coinAvailabilities = coinAvailabilitiesR.getOrFail()
    const importedAddress = importedAddressesR.getOrElse([])
    const prunedAccounts = [] as Array<SwapAccountType>

    // TODO: move to swap account selector, also needs to account for BCH
    map(
      importedAddress =>
        prunedAccounts.push({
          address: importedAddress.addr,
          balance: importedAddress.final_balance,
          baseCoin: 'BTC',
          coin: 'BTC',
          label: importedAddress.label,
          type: 'ACCOUNT'
        } as SwapAccountType),
      importedAddress
    )

    map(
      coin =>
        map(acct => {
          // remove account if any if any of following are true
          // - account is custodial
          // - coin receive feature is currently disabled
          // - form has a selected coin and it doesnt match accounts coin type
          acct.type !== 'CUSTODIAL' &&
            (selectedCoin === 'ALL'
              ? coinAvailabilities[acct.coin].request
              : acct.coin === selectedCoin) &&
            prunedAccounts.push(acct)
        }, coin),
      accounts
    )

    return prunedAccounts
  }
)
