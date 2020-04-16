import { createDeepEqualSelector } from 'services/ReselectHelper'
import { head, last, lift, prop } from 'ramda'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.data.misc.getPriceIndexSeries,
    selectors.core.settings.getCurrency
  ],
  (priceIndexSeriesR, currencyR) => {
    const transform = (priceIndexSeries, currency) => {
      const priceStart = prop('price', head(priceIndexSeries))
      const priceCurrent = prop('price', last(priceIndexSeries))
      const priceChangeFiat = priceCurrent - priceStart
      const priceChangePercentage = (priceChangeFiat / priceStart) * 100
      return {
        currency,
        priceChangeFiat,
        priceCurrent,
        priceChangePercentage
      }
    }

    return lift(transform)(priceIndexSeriesR, currencyR)
  }
)
