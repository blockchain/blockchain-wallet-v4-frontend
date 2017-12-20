import { RemoteData } from 'blockchain-wallet-v4/src'
import { map } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const priceIndexSeries = selectors.core.data.misc.getPriceIndexSeries(state)
  const transform = x => map(d => [d.timestamp * 1000, d.price], x)

  return {
    value: RemoteData.map(transform, priceIndexSeries)
  }
}
