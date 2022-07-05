import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { getBalanceSelector, getErc20Balance } from 'components/Balances/selectors'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    (state) => selectors.components.interest.getInterestEligible(state),
    (state) => selectors.components.interest.getInterestRate(state),
    selectors.prices.getAllCoinPrices,
    selectors.prices.getAllCoinPricesPreviousDay,
    (state) => state
  ],
  (interestEligibleR, interestRateR, coinPricesR, coinPricesPreviousR, state) => {
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
          interestEligible: interestEligibleR.getOrElse({}),
          interestRate: interestRateR.getOrElse({}),
          marketCap,
          name: `${coinfig.name} (${coinfig.displaySymbol})`,
          price: currentPrice,
          priceChange: priceChangeStr,
          products: coinfig.products
        }
      })

      // filter out undefined coins, zero value coins and coins with inflated marketcaps
      return coinPricesList?.filter((coin) => {
        return coin.price && coin.price !== 0 && coin.coin !== 'HOKK'
      })
    }

    return lift(transform)(coinPricesR, coinPricesPreviousR)
  }
)

export default getData
