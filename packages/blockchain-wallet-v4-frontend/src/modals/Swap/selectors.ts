import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

const getData = createDeepEqualSelector(
  [
    selectors.modules.profile.getUserData,
    selectors.core.settings.getCurrency,
    selectors.components.swap.getFix,
    selectors.components.swap.getCustodialEligibility
  ],
  (userDataR, walletCurrencyR, fix, custodialEligibilityR) => {
    return lift(
      (
        userData: ExtractSuccess<typeof userDataR>,
        walletCurrency: FiatType,
        custodialEligibility: ExtractSuccess<typeof custodialEligibilityR>
      ) => ({
        custodialEligibility,
        fix,
        userData,
        walletCurrency
      })
    )(userDataR, walletCurrencyR, custodialEligibilityR)
  }
)

export default getData
