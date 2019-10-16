import { lift, map, prop, isNil, path } from 'ramda'
import { selectors } from 'data'
import { Exchange } from 'blockchain-wallet-v4/src'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.core.settings.getCurrency,
    selectors.preferences.getPriceChart,
    selectors.components.priceChart.getCoin,
    selectors.components.priceChart.getTime,
    selectors.core.data.misc.getPriceIndexSeries,
    selectors.modules.profile.getUserTiers
  ],
  (
    currencyR,
    priceChartPreferences,
    coin,
    time,
    priceIndexSeriesDataR,
    userTiers
  ) => {
    const currency = currencyR.getOrElse('USD')
    const currencySymbol = Exchange.getSymbol(currency)
    const cacheCoin = prop('coin', priceChartPreferences)
    const cacheTime = prop('time', priceChartPreferences)

    const isSilverOrAbove = !isNil(path(['data', 'current'], userTiers))

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
      },
      isSilverOrAbove
    }
  }
)
