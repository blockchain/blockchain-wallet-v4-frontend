import { selectors } from 'data'

import { useRemote } from '../useRemote'
import { PriceIndexSeriesHook } from './types'

export const usePriceIndexSeries: PriceIndexSeriesHook = () => {
  const state = useRemote(selectors.core.data.misc.getPriceIndexSeries)

  return {
    ...state,
    data: state.data?.map(({ timestamp, ...serie }) => ({
      ...serie,
      timestamp: timestamp * 1000
    }))
  }
}
