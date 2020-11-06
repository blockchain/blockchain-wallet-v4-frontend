import { createDeepEqualSelector } from 'services/ReselectHelper'
import { ExtractSuccess, FiatType } from 'core/types'
import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.modules.profile.getUserData,
    selectors.core.walletOptions.getSupportedCoins,
    selectors.core.settings.getCurrency,
    selectors.components.swap.getFix
  ],
  (userDataR, coinsR, walletCurrencyR, fix) => {
    return lift(
      (
        userData: ExtractSuccess<typeof userDataR>,
        coins: ExtractSuccess<typeof coinsR>,
        walletCurrency: FiatType
      ) => ({
        userData,
        coins,
        walletCurrency,
        fix
      })
    )(userDataR, coinsR, walletCurrencyR)
  }
)
