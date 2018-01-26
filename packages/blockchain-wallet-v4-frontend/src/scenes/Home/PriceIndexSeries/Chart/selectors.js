import { selectors } from 'data'
import { map } from 'ramda'

export const getData = state =>
  selectors.core.data.misc.getPriceIndexSeries(state)
    .map(map(d => [d.timestamp * 1000, d.price]))
