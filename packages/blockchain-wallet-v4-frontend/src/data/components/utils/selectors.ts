import { isNil, lift, mapObjIndexed, reject, values } from 'ramda'

import {
  CoinTypeEnum,
  ExtractSuccess,
  SupportedWalletCurrencyType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getSupportedCoinsWithMethodAndOrder = (state: RootState) => {
  const sbMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  const transform = (
    paymentMethods: ExtractSuccess<typeof sbMethodsR>,
    supportedCoins: ExtractSuccess<typeof supportedCoinsR>
  ) => {
    // remove coins that may not yet exist in wallet options to avoid app crash
    const coinOrder = reject(isNil)([
      supportedCoins.USD,
      supportedCoins.EUR,
      supportedCoins.GBP,
      supportedCoins.BTC,
      supportedCoins.ETH,
      supportedCoins.BCH,
      supportedCoins.XLM,
      supportedCoins.WDGLD,
      supportedCoins.ALGO,
      supportedCoins.PAX,
      supportedCoins.USDT,
      supportedCoins.AAVE,
      supportedCoins.DOT,
      supportedCoins.YFI
    ])

    return values(
      mapObjIndexed((coin: SupportedWalletCurrencyType) => {
        return {
          ...coin,
          method:
            coin.coinCode in CoinTypeEnum ||
            !!paymentMethods.methods.find(
              method =>
                method.currency === coin.coinCode && method.type === 'FUNDS'
            )
        }
      }, coinOrder)
    )
  }

  return lift(transform)(sbMethodsR, supportedCoinsR)
}
