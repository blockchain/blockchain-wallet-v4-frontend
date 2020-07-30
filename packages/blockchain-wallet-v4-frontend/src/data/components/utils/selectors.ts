import {
  CoinTypeEnum,
  ExtractSuccess,
  SupportedWalletCurrencyType
} from 'blockchain-wallet-v4/src/types'
import { lift, mapObjIndexed, values } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getSupportedCoinsWithBalanceAndOrder = (state: RootState) => {
  const sbBalancesR = selectors.components.simpleBuy.getSBBalances(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  const transform = (
    balances: ExtractSuccess<typeof sbBalancesR>,
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
          method: coin.coinCode in CoinTypeEnum || balances[coin.coinCode]
        }
      }, coinOrder)
    )
  }

  return lift(transform)(sbBalancesR, supportedCoinsR)
}
