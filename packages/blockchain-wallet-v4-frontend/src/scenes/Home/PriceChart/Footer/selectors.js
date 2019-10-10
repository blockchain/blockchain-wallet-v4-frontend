import { includes, isNil, path } from 'ramda'

import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.priceChart.getCoin,
    selectors.core.settings.getCountryCode,
    selectors.core.walletOptions.getCoinifyCountries,
    selectors.core.walletOptions.getSupportedCoins,
    selectors.modules.profile.getUserTiers
  ],
  (coinTicker, countryCode, coinifyCountries, supportedCoins, userTiers) => {
    const coinName = path(['data', coinTicker, 'displayName'], supportedCoins)
    const isCoinifySupported = includes(countryCode.data, coinifyCountries.data)
    const isSilverOrAbove = !isNil(path(['data', 'current'], userTiers))

    return {
      coinTicker,
      coinName,
      isCoinifySupported,
      isSilverOrAbove
    }
  }
)
