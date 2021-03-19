import { lift, map, not, reject, values } from 'ramda'

import {
  CoinTypeEnum,
  ExtractSuccess,
  SupportedCoinType
} from 'blockchain-wallet-v4/src/types'
import { getAllCoinsBalancesSelector } from 'components/Balances/selectors'
import { selectors } from 'data'

export const getData = state => {
  const coinPricesR = selectors.prices.getAllCoinPrices(state)
  const coinPricesPreviousR = selectors.prices.getAllCoinPricesPreviousDay(
    state
  )
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const coinBalances = getAllCoinsBalancesSelector(state)

  const transform = (
    coinPrices: ExtractSuccess<typeof coinPricesR>,
    coinPricesPrevious: ExtractSuccess<typeof coinPricesPreviousR>,
    supportedCoins: ExtractSuccess<typeof supportedCoinsR>
  ) => {
    // logic to exclude fiat currencies from list
    return reject(
      not,
      values(
        // @ts-ignore
        map((coin: SupportedCoinType) => {
          const currentPrice = coinPrices[coin.coinCode]
          const yesterdayPrice = coinPricesPrevious[coin.coinCode]
          return (
            coin.coinCode in CoinTypeEnum && {
              coin: coin.coinCode,
              coinModel: coin,
              name: `${coin.displayName} (${coin.coinTicker})`,
              price: currentPrice,
              priceChange: Number(
                ((yesterdayPrice - currentPrice) / yesterdayPrice) * 100
              ).toPrecision(2),
              balance: coinBalances[coin.coinCode]
            }
          )
        }, supportedCoins)
      )
    )
  }

  return lift(transform)(coinPricesR, coinPricesPreviousR, supportedCoinsR)
}
