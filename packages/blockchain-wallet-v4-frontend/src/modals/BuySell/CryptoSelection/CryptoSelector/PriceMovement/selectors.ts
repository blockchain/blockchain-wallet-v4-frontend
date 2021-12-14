import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.prices.getAllCoinPrices,
    selectors.prices.getAllCoinPricesPreviousDay,
    (state, ownProps) => ownProps.coin
  ],
  (coinPricesR, previousCoinPricesR, coin) => {
    const transform = (
      coinPrices: ExtractSuccess<typeof coinPricesR>,
      previousCoinPrices: ExtractSuccess<typeof coinPricesR>
    ) => {
      const currentPrice = coinPrices[coin]
      const yesterdayPrice = previousCoinPrices[coin]
      const priceChangeNum = Number(((currentPrice - yesterdayPrice) / yesterdayPrice) * 100)
      return Number.isNaN(priceChangeNum) ? '0' : priceChangeNum.toFixed(2)
    }

    return lift(transform)(coinPricesR, previousCoinPricesR)
  }
)
