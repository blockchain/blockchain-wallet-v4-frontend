import { lift, map, prop } from 'ramda'
import { selectors } from 'data'

export const getData = (state) => {
  const currencyR = selectors.core.settings.getCurrency(state)
  const priceChartPref = selectors.preferences.getPriceChart(state)
  const cacheCoin = prop('coin', priceChartPref)
  const cacheTime = prop('time', priceChartPref)
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
