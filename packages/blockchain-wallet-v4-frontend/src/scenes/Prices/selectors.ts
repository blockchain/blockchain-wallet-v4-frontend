import BigNumber from 'bignumber.js'
import { lift, map } from 'ramda'

import { getAllCoinsBalancesSelector, getErc20Balance } from 'components/Balances/selectors'
import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.prices.getAllCoinPrices,
    selectors.prices.getAllCoinPricesPreviousDay,
    getAllCoinsBalancesSelector,
    (state) => state
  ],
  (coinPricesR, coinPricesPreviousR, coinBalances, state) => {
    const transform = (
      coinPrices: ExtractSuccess<typeof coinPricesR>,
      coinPricesPrevious: ExtractSuccess<typeof coinPricesPreviousR>
    ) => {
      const cryptos = selectors.components.swap.getCoins()

      return map((coin: string) => {
        const { coinfig } = window.coins[coin]

        const currentPrice = coinPrices[coinfig.symbol]
        const yesterdayPrice = coinPricesPrevious[coinfig.symbol]
        return (
          coinfig.type.name !== 'FIAT' && {
            balance:
              coinBalances[coinfig.symbol] || getErc20Balance(coinfig.symbol)(state).getOrElse(0),
            coin: coinfig.symbol,
            coinModel: coin,
            name: `${coinfig.name} (${coinfig.displaySymbol})`,
            price: currentPrice,
            priceChange: Number(
              ((currentPrice - yesterdayPrice) / yesterdayPrice) * 100
            ).toPrecision(2)
          }
        )
      }, cryptos)
    }

    return lift(transform)(coinPricesR, coinPricesPreviousR)
  }
)

export default getData
