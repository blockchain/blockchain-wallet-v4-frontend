import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { getBalanceSelector, getErc20Balance } from 'components/Balances/selectors'
import { selectors } from 'data'

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
      const cryptos = selectors.core.data.coins.getAllCoins()

      const m = cryptos.map((coin: string) => {
        const { coinfig } = window.coins[coin]

        const currentPrice = coinPrices[coinfig.symbol]
        const yesterdayPrice = coinPricesPrevious[coinfig.symbol]
        const coinBalance = getBalanceSelector(coinfig.symbol)(state).getOrElse(0).valueOf()
        const priceChangeNum = Number(((currentPrice - yesterdayPrice) / yesterdayPrice) * 100)
        const priceChangeStr = Number.isNaN(priceChangeNum) ? '0' : priceChangeNum.toPrecision(2)

        return {
          balance:
            coinfig.type.name === 'ERC20'
              ? getErc20Balance(coinfig.symbol)(state).getOrElse(0)
              : coinBalance,
          coin: coinfig.symbol,
          coinModel: coin,
          name: `${coinfig.name} (${coinfig.displaySymbol})`,
          price: currentPrice,
          priceChange: priceChangeStr,
          products: coinfig.products
        }
      })

      return m?.filter(({ price }) => {
        return !!price || price === 0
      })
    }

    return lift(transform)(coinPricesR, coinPricesPreviousR)
  }
)

export default getData
