import { selectors } from 'data'
import { head, last, lift, prop } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.core.data.misc.getPriceIndexSeries,
    selectors.core.settings.getCurrency
  ],
  (priceIndexSeriesR, currencyR) => {
    const transform = (priceIndexSeries, currency) => {
      const priceStart = prop('price', head(priceIndexSeries))
      const priceEnd = prop('price', last(priceIndexSeries))
      const priceChange = priceEnd - priceStart
      const pricePercentageChange = (priceChange / priceEnd) * 100
      return {
        currency,
        priceChange,
        pricePercentageChange
      }
    }

    return lift(transform)(priceIndexSeriesR, currencyR)
  }
)
