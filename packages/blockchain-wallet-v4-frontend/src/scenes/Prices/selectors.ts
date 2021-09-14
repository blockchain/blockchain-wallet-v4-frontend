import { lift, map } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { getAllCoinsBalancesSelector, getErc20Balance } from 'components/Balances/selectors'
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
            name: `${coinfig.name} (${coinfig.symbol})`,
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
