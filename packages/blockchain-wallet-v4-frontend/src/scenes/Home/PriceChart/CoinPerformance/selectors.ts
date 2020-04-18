import { createDeepEqualSelector } from 'services/ReselectHelper'
import { head, last, lift, prop } from 'ramda'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.data.misc.getPriceIndexSeries,
    selectors.components.priceChart.getTime,
    selectors.core.settings.getCurrency
  ],
  (priceIndexSeriesR, priceChartTime, currencyR) => {
    const transform = (priceIndexSeries, currency) => {
      // @ts-ignore
      const priceStart = prop('price', head(priceIndexSeries))
      // @ts-ignore
      const priceEnd = prop('price', last(priceIndexSeries))
      const priceChange = priceEnd - priceStart
      const pricePercentageChange = (priceChange / priceStart) * 100
      return {
        currency,
        priceChartTime,
        priceChange,
        pricePercentageChange
      }
    }

    return lift(transform)(priceIndexSeriesR, currencyR)
  }
)
