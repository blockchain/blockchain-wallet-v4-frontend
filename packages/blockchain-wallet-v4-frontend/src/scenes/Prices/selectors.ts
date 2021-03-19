import { lift, map, not, reject, values } from 'ramda'

import {
  CoinTypeEnum,
  ExtractSuccess,
  SupportedCoinType
} from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { getAllCoinsBalancesSelector } from 'components/Balances/selectors'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.prices.getAllCoinPrices,
    selectors.prices.getAllCoinPricesPreviousDay,
    selectors.core.walletOptions.getSupportedCoins,
    getAllCoinsBalancesSelector
  ],
  (coinPricesR, coinPricesPreviousR, supportedCoinsR, coinBalances) => {
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
)
