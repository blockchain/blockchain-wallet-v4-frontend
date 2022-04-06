import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { selectors } from 'data'

import { CoinRatesHook, CoinRatesHookData } from './types'

export const useCoinRates: CoinRatesHook = ({ coin }) => {
  const rate = useSelector((state) => selectors.core.data.misc.getRatesSelector(coin, state))

  const data: CoinRatesHookData | undefined = useMemo(() => {
    const { data: rateData } = rate

    if (!rateData) return undefined

    const coinRateData: CoinRatesHookData = {
      price: rateData.price,
      timestamp: rateData.timestamp * 1000,
      volume24h: rateData.volume24h
    }

    return coinRateData
  }, [rate])

  return {
    data
  }
}
