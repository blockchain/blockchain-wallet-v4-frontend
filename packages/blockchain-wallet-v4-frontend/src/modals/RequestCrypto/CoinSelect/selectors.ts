import { map } from 'ramda'

import { CoinAccountSelectorType, REQUEST_SELECTOR_CONFIG } from 'coins'
import { createDeepEqualSelector } from 'services/misc'
import { selectors } from 'data'
import { SwapAccountType } from 'data/components/swap/types'

export const getData = createDeepEqualSelector(
  [
    (state, ownProps) => selectors.components.swap.getActiveAccounts(state, {
      coins: ownProps.requestableCoins,
      ...REQUEST_SELECTOR_CONFIG
    } as CoinAccountSelectorType),
    selectors.core.walletOptions.getAllCoinAvailabilities,
    (state, ownProps) => ownProps
  ],
  (accounts, coinAvailabilitiesR, ownProps) => {
    const { selectedCoin } = ownProps?.formValues || {}
    const coinAvailabilities = coinAvailabilitiesR.getOrFail()
    const prunedAccounts = [] as Array<SwapAccountType>

    map(
      coin =>
        map(acct => {
          // remove account if any if either of following are true
          // - coin receive feature is currently disabled
          // - form has a selected coin and it doesnt match accounts coin type
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
