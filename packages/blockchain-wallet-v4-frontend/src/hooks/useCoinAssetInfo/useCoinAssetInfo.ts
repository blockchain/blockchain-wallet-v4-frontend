import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'

import { selectors } from 'data'

import { CoinAssetInfoApiData, CoinAssetInfoHook } from './useCoinAssetInfo.types'

const useCoinAssetInfo: CoinAssetInfoHook = ({ coin }) => {
  const {
    data: { api }
  } = useSelector(selectors.core.walletOptions.getDomains)

  return useQuery<CoinAssetInfoApiData>([api, 'assets/info', coin], async () => {
    const response = await fetch(`${api}/assets/info/${coin}`)

    const responseData = await response.json()

    const { description, website, whitepaper } = responseData

    return {
      ...responseData,
      description: !description ? undefined : description,
      website: !website ? undefined : website,
      whitepaper: !whitepaper ? undefined : whitepaper
    }
  })
}

export default useCoinAssetInfo
