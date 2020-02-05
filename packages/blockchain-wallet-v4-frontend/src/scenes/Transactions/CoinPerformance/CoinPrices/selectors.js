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
      const priceChange = priceCurrent - priceStart
      const pricePercentageChange = (priceChange / priceStart) * 100
      return {
        currency,
        priceChange,
        priceCurrent,
        pricePercentageChange
      }
    }

    return lift(transform)(priceIndexSeriesR, currencyR)
  }
)
