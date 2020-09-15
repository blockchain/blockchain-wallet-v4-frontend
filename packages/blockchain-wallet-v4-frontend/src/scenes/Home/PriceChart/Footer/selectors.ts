import { CoinType, SupportedWalletCurrenciesType } from 'core/types'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.components.priceChart.getCoin,
    selectors.core.walletOptions.getSupportedCoins
  ],
  (coinTicker: CoinType, supportedCoinsR) => {
    const supportedCoins = supportedCoinsR.getOrElse(
      {} as SupportedWalletCurrenciesType
    )
    const cryptoCurrency = supportedCoins[coinTicker].coinCode
    const coinName = supportedCoins[coinTicker].displayName

    return {
      cryptoCurrency,
      coinTicker,
      coinName
    }
  }
)
