import { lift, map } from 'ramda'
import { selectors } from 'data'

export const getData = (state) => {
  const currency = 'USD'
  const coin = selectors.components.priceChart.getCoin(state)
  const time = selectors.components.priceChart.getTime(state)
  const priceIndexSeriesDataR = selectors.core.data.misc.getPriceIndexSeries(state)

  const transform = (priceIndexSeriesData) => ({
    currency,
    coin,
    time,
    data: map(d => [d.timestamp * 1000, d.price], priceIndexSeriesData)
  })

  return lift(transform)(priceIndexSeriesDataR)
}
