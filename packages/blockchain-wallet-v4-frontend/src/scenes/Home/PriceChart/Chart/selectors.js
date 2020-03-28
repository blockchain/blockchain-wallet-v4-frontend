import { createDeepEqualSelector } from 'services/ReselectHelper'
import { Exchange } from 'blockchain-wallet-v4/src'
import { lift, map, prop } from 'ramda'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.settings.getCurrency,
    selectors.preferences.getPriceChart,
    selectors.components.priceChart.getCoin,
    selectors.components.priceChart.getTime,
    selectors.core.data.misc.getPriceIndexSeries
  ],
  (currencyR, priceChartPreferences, coin, time, priceIndexSeriesDataR) => {
    const currency = currencyR.getOrElse('USD')
    const currencySymbol = Exchange.getSymbol(currency)
    const cacheCoin = prop('coin', priceChartPreferences)
    const cacheTime = prop('time', priceChartPreferences)

    const transform = priceIndexSeriesData => ({
      data: map(d => [d.timestamp * 1000, d.price], priceIndexSeriesData),
      coin,
      time
    })
    return {
      data: lift(transform)(priceIndexSeriesDataR),
      currency,
      currencySymbol,
      cache: {
        coin: cacheCoin,
        time: cacheTime
      }
    }
  }
)
