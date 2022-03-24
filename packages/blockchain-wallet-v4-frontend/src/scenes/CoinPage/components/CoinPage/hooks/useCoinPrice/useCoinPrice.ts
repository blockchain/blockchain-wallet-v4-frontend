import { useSelector } from 'react-redux'

import { PriceChangeType, RemoteDataType, TimeRange } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { UseCoinPrice } from './types'

export const useCoinPrice: UseCoinPrice = ({ coin }) => {
  const result = useSelector<RootState, RemoteDataType<string, PriceChangeType> | undefined>(
    (state) => selectors.core.data.misc.getPriceChange(coin, TimeRange.WEEK, state)
  )

  return result?.data
}
