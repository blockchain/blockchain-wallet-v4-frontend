import { RatesType } from '@core/types'
import { selectors } from 'data'

import { useRemote } from '../useRemote'
import { CoinRatesHookProps } from './types'

export const useCoinRates = ({ coin }: CoinRatesHookProps) =>
  useRemote<string, RatesType>((state) => {
    const ratesData = selectors.core.data.misc.getRatesSelector(coin, state)

    return ratesData.map((data) => {
      if (!data) return data

      return {
        ...data,
        timestamp: data.timestamp * 1000
      }
    })
  })
