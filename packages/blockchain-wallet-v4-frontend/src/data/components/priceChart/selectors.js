import { lift, map, path } from 'ramda'
import * as selectors from '../../selectors'
import { calculateInterval, calculateStart } from './services'

export const getCoin = path(['components', 'price_chart', 'coin'])

export const getTime = path(['components', 'price_chart', 'time'])

export const getData = state => {
  const currency = 'USD'
  const coin = getCoin(state)
  const time = getTime(state)
  const priceIndexSeriesDataR = selectors.core.data.misc.getPriceIndexSeries(state)

  const transform = (priceIndexSeriesData) => ({
    currency,
    coin,
    time,
    start: calculateStart(coin, time),
    interval: calculateInterval(coin, time),
    data: map(d => [d.timestamp * 1000, d.price], priceIndexSeriesData)
  })

  return lift(transform)(priceIndexSeriesDataR)
}
