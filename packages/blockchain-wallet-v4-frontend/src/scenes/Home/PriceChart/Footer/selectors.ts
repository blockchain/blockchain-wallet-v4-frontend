import { CoinType, SupportedWalletCurrenciesType } from 'core/types'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.components.priceChart.getCoin,
    selectors.core.walletOptions.getSupportedCoins
  ],
  (coinTicker, supportedCoins) => {
    const cryptoCurrency = supportedCoins.getOrElse(
      {} as SupportedWalletCurrenciesType
    )[coinTicker as CoinType].coinCode
    const coinName = supportedCoins.getOrElse(
      {} as SupportedWalletCurrenciesType
    )[coinTicker as CoinType].displayName

    return {
      cryptoCurrency,
      coinTicker,
      coinName
    }
  }
)
