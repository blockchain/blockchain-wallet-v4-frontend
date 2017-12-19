import { RemoteData } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getChart = (state) => {
  const priceIndexSeries = selectors.core.data.misc.getPriceIndexSeries(state)
  const currency = selectors.core.settings.getCurrency(state)
  return RemoteData.concat(priceIndexSeries, currency)
}
