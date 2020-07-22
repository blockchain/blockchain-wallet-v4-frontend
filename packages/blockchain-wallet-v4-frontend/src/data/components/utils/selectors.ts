import {
  CoinTypeEnum,
  ExtractSuccess,
  SupportedWalletCurrencyType
} from 'blockchain-wallet-v4/src/types'
import { lift, mapObjIndexed, values } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getSupportedCoinsWithMethodAndOrder = (state: RootState) => {
  const sbMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  const transform = (
    paymentMethods: ExtractSuccess<typeof sbMethodsR>,
    supportedCoins: ExtractSuccess<typeof supportedCoinsR>
  ) => {
    const coinOrder = [
      supportedCoins.EUR,
      supportedCoins.GBP,
      supportedCoins.BTC,
      supportedCoins.ETH,
      supportedCoins.BCH,
      supportedCoins.XLM,
      supportedCoins.ALGO,
      supportedCoins.PAX,
      supportedCoins.USDT
    ]
    return values(
      mapObjIndexed((coin: SupportedWalletCurrencyType) => {
        return {
          ...coin,
          method:
            coin.coinCode in CoinTypeEnum ||
            !!paymentMethods.methods.find(
              method => method.currency === coin.coinCode
            )
        }
      }, coinOrder)
    )
  }

  return lift(transform)(sbMethodsR, supportedCoinsR)
}
