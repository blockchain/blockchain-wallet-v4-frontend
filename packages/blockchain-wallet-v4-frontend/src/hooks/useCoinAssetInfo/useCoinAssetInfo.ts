import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { selectors } from 'data'

import { useFetcher } from '../useFetcher'
import { CoinAssetInfoApiData, CoinAssetInfoHook } from './useCoinAssetInfo.types'

const useCoinAssetInfo: CoinAssetInfoHook = ({ coin }) => {
  const {
    data: { api }
  } = useSelector(selectors.core.walletOptions.getDomains)

  const { data, ...state } = useFetcher<CoinAssetInfoApiData>(`${api}/assets/info/${coin}`)

  const parsedData = useMemo(() => {
    if (!data) return data

    return {
      ...data,
      description: !data.description ? undefined : data.description,
      website: !data.website ? undefined : data.website,
      whitepaper: !data.whitepaper ? undefined : data.whitepaper
    }
  }, [data])

  return {
    ...state,
    data: parsedData
  }
}

export default useCoinAssetInfo
