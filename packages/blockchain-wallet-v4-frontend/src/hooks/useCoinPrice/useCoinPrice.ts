import { Remote } from '@core'
import { PriceChangeType, TimeRange } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { useRemote } from '../useRemote'
import { CoinPriceHook } from './types'

export const useCoinPrice: CoinPriceHook = ({ coin, range }) => {
  return useRemote<string, PriceChangeType, RootState>((state) => {
    const result = selectors.core.data.misc.getPriceChange(coin, TimeRange[range], state)

    return result || Remote.NotAsked
  })
}
