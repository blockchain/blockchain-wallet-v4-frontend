import { lift, map } from 'ramda'
import { selectors } from 'data'

export const getData = (state) => {
  const currencyR = selectors.core.settings.getCurrency(state)
  const { cacheCoin, cacheTime } = selectors.preferences.getPriceChart(state)
  const coin = selectors.components.priceChart.getCoin(state)
  const time = selectors.components.priceChart.getTime(state)
  const priceIndexSeriesDataR = selectors.core.data.misc.getPriceIndexSeries(state)

  const transform = (priceIndexSeriesData) => ({
    data: map(d => [d.timestamp * 1000, d.price], priceIndexSeriesData),
    coin,
    time
  })

  return {
    data: lift(transform)(priceIndexSeriesDataR),
    currency: currencyR.getOrElse('USD'),
    cache: {
      coin: cacheCoin,
      time: cacheTime
    }
  }
}
