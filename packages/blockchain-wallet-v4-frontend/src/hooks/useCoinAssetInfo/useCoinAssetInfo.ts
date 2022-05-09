import { useSelector } from 'react-redux'

import { selectors } from 'data'

import { useFetcher } from '../useFetcher'
import { CoinAssetInfoApiData, CoinAssetInfoHook } from './useCoinAssetInfo.types'

const useCoinAssetInfo: CoinAssetInfoHook = ({ coin }) => {
  const {
    data: { api }
  } = useSelector(selectors.core.walletOptions.getDomains)

  return useFetcher<CoinAssetInfoApiData>(`${api}/assets/info/${coin}`)
}

export default useCoinAssetInfo
