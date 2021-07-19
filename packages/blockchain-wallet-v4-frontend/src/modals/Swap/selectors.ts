import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

const getData = createDeepEqualSelector(
  [
    selectors.modules.profile.getUserData,
    selectors.core.settings.getCurrency,
    selectors.components.swap.getFix
  ],
  (userDataR, walletCurrencyR, fix) => {
    return lift((userData: ExtractSuccess<typeof userDataR>, walletCurrency: FiatType) => ({
      fix,
      userData,
      walletCurrency
    }))(userDataR, walletCurrencyR)
  }
)

export default getData
