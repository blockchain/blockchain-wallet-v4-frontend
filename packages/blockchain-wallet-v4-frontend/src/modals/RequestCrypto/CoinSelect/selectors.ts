import { map } from 'ramda'

import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'
import { REQUEST_ACCOUNTS_SELECTOR } from 'data/coins/model/request'
import { getCoinAccounts } from 'data/coins/selectors'
import { CoinAccountSelectorType } from 'data/coins/types'
import { SwapAccountType } from 'data/components/swap/types'
import { UserDataType } from 'data/types'

export const getData = createDeepEqualSelector(
  [
    (state, ownProps) =>
      getCoinAccounts(state, {
        coins: ownProps.requestableCoins,
        ...REQUEST_ACCOUNTS_SELECTOR
      } as CoinAccountSelectorType),
    selectors.core.walletOptions.getAllCoinAvailabilities,
    selectors.modules.profile.getUserData,
    (state, ownProps) => ({ ownProps, state })
  ],
  (accounts, coinAvailabilitiesR, userDataR, { ownProps }) => {
    const { selectedCoin } = ownProps?.formValues || {}
    const coinAvailabilities = coinAvailabilitiesR.getOrFail(
      'No available coins.'
    )
    const prunedAccounts = [] as Array<SwapAccountType>
    const userData = userDataR.getOrElse({
      tiers: { current: 0, next: 0, selected: 0 }
    } as UserDataType)
    const isAtLeastTier1 = userData.tiers.current >= 1

    // @ts-ignore
    map(
      coin =>
        map((acct: any) => {
          // remove account if any if either of following are true
          // - coin receive feature is currently disabled
          // - form has a selected coin and it doesnt match accounts coin type
          if (
            selectedCoin === 'ALL'
              ? coinAvailabilities[acct.coin].request
              : acct.coin === selectedCoin
          ) {
            prunedAccounts.push(acct)
          }
        }, coin),
      accounts
    )

    return { isAtLeastTier1, accounts: prunedAccounts }
  }
)
