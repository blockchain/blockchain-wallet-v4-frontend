import { lift } from 'ramda'

import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import {
  ExtractSuccess,
  WalletCurrencyType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState, coin, amount, hideCoinTicker) => {
  const coinsR = selectors.core.walletOptions.getSupportedCoins(state)

  const convert = (
    coins: ExtractSuccess<typeof coinsR>,
    coin: WalletCurrencyType,
    value
  ) => {
    const config = coins[coin]
    return hideCoinTicker
      ? Exchange.convertCoinToCoin({ value, coin, isFiat: config.isFiat })
      : Exchange.displayCoinToCoin(value, coin, config.isFiat)
  }
  return lift(convert)(coinsR, Remote.of(coin), Remote.of(amount))
}
