import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

import { sortCoins } from './utils'

export const getData = createDeepEqualSelector(
  [
    selectors.prices.getAllCoinPrices,
    selectors.prices.getAllCoinPricesPreviousDay,
    (state) => state
  ],
  (coinPricesR, coinPricesPreviousR, state) => {
    const transform = (
      coinPrices: ExtractSuccess<typeof coinPricesR>,
      coinPricesPrevious: ExtractSuccess<typeof coinPricesPreviousR>
    ) => {
      const coinList = selectors.core.data.coins.getAllCoins()
      const coinPricesList = coinList.map((coin: string) => {
        const { coinfig } = window.coins[coin]
        const currentPrice = coinPrices[coinfig.symbol]?.price
        const yesterdayPrice = coinPricesPrevious[coinfig.symbol]?.price
        // some market caps returned as null
        const marketCap = coinPrices[coinfig.symbol]?.marketCap
          ? coinPrices[coinfig.symbol]?.marketCap
          : 0
        const coinBalance = selectors.balances
          .getCoinTotalBalance(coinfig.symbol)(state)
          .getOrElse(0)
          .valueOf()
        const priceChangeNum = Number(((currentPrice - yesterdayPrice) / yesterdayPrice) * 100)
        const priceChangeStr = Number.isNaN(priceChangeNum) ? '0' : priceChangeNum.toPrecision(2)

        return {
          balance: coinBalance,
          coin: coinfig.symbol,
          coinModel: coin,
          marketCap,
          name: `${coinfig.name} (${coinfig.displaySymbol})`,
          price: currentPrice,
          priceChange: priceChangeStr,
          products: coinfig.products
        }
      })

      // filter out undefined coins, zero value coins and coins with inflated marketcaps
      const filteredCoinPricesList = coinPricesList.filter((coin) => {
        return coin.price && coin.price !== 0 && coin.coin !== 'HOKK'
      })

      return sortCoins(filteredCoinPricesList)
    }

    return lift(transform)(coinPricesR, coinPricesPreviousR)
  }
)

export default getData
