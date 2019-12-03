import { createDeepEqualSelector } from 'services/ReselectHelper'
import { includes, path } from 'ramda'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.components.priceChart.getCoin,
    selectors.core.settings.getCountryCode,
    selectors.core.walletOptions.getCoinifyCountries,
    selectors.core.walletOptions.getSupportedCoins,
    selectors.modules.profile.isSilverOrAbove
  ],
  (
    coinTicker,
    countryCode,
    coinifyCountries,
    supportedCoins,
    isSilverOrAbove
  ) => {
    const coinName = path(['data', coinTicker, 'displayName'], supportedCoins)
    const isCoinifySupported = includes(countryCode.data, coinifyCountries.data)

    return {
      coinTicker,
      coinName,
      isCoinifySupported,
      isSilverOrAbove
    }
  }
)
