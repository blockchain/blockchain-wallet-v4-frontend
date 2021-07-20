import { lift, map, not, reject, values } from 'ramda'

import { ExtractSuccess, SupportedCoinType } from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { getAllCoinsBalancesSelector, getErc20Balance } from 'components/Balances/selectors'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.prices.getAllCoinPrices,
    selectors.prices.getAllCoinPricesPreviousDay,
    selectors.components.utils.getCoinsWithMethodAndOrder,
    getAllCoinsBalancesSelector,
    (state) => state
  ],
  (coinPricesR, coinPricesPreviousR, coinsWithMethodAndOrderR, coinBalances, state) => {
    const transform = (
      coinPrices: ExtractSuccess<typeof coinPricesR>,
      coinPricesPrevious: ExtractSuccess<typeof coinPricesPreviousR>,
      coinsWithMethodAndOrder: ExtractSuccess<typeof coinsWithMethodAndOrderR>
    ) => {
      // logic to exclude fiat currencies from list
      return reject(
        not,
        values(
          // @ts-ignore
          map((coin: SupportedCoinType) => {
            const { coinfig } = coin

            const currentPrice = coinPrices[coinfig.symbol]
            const yesterdayPrice = coinPricesPrevious[coinfig.symbol]
            return (
              !coinfig.type.isFiat && {
                balance:
                  coinBalances[coinfig.symbol] ||
                  getErc20Balance(coinfig.symbol)(state).getOrElse(0),
                coin: coinfig.symbol,
                coinModel: coin,
                name: `${coinfig.name} (${coinfig.symbol})`,
                price: currentPrice,
                priceChange: Number(
                  ((currentPrice - yesterdayPrice) / yesterdayPrice) * 100
                ).toPrecision(2)
              }
            )
          }, coinsWithMethodAndOrder)
        )
      )
    }

    return lift(transform)(coinPricesR, coinPricesPreviousR, coinsWithMethodAndOrderR)
  }
)

export default getData
