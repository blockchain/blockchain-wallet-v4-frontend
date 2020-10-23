import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'

import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.modules.profile.getUserData,
    selectors.core.walletOptions.getSupportedCoins
  ],
  (userDataR, coinsR) => {
    return lift(
      (
        userData: ExtractSuccess<typeof userDataR>,
        coins: ExtractSuccess<typeof coinsR>
      ) => ({
        userData,
        coins
      })
    )(userDataR, coinsR)
  }
)
