import { UseQueryResult } from 'react-query'

import { CoinType } from '@core/types'

type CoinAssetInfoApiData = {
  currencyInfo: {
    displaySymbol: string
    name: string
    precision: number
    symbol: string
    type: {
      logoPngUrl: string
      minimumOnChainConfirmations: number
      name: string
      websiteUrl: string
    }
  }
  description?: string
  language: string
  website?: string
  whitepaper?: string
}

type CoinAssetInfoHookProps = { coin: CoinType }

type CoinAssetInfoHook = (props: CoinAssetInfoHookProps) => UseQueryResult<CoinAssetInfoApiData>

export type { CoinAssetInfoApiData, CoinAssetInfoHook, CoinAssetInfoHookProps }
