import {
  CoinType,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'

import { selectors } from 'data'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'

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
