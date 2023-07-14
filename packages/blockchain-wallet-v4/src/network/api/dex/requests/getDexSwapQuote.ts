import { CoinType } from '@core/types'

import type { RequestConfig } from '../../http'
import { DEX_NABU_GATEWAY_PREFIX } from '../constants'
import { DexSwapQuoteSchema } from '../schemas'
import type { DexSwapQuote } from '../types'

type Data = {
  fromCurrency: {
    address: string
    amount?: string
    chainId: number
    symbol: CoinType
  }
  params: {
    slippage: string
  }
  takerAddress: string
  toCurrency: {
    address: string
    amount?: string
    chainId: number
    symbol: CoinType
  }
  venue: 'ZEROX'
}

export const getDexSwapQuote =
  ({
    apiUrl,
    authorizedPost
  }: {
    apiUrl: string
    authorizedPost: (config: RequestConfig) => Promise<unknown>
  }) =>
  (data: Data): Promise<DexSwapQuote> => {
    return authorizedPost({
      contentType: 'application/json',
      data,
      endPoint: `${DEX_NABU_GATEWAY_PREFIX}/quote`,
      params: { product: 'DEX' },
      removeDefaultPostData: true,
      url: apiUrl
    }).then((data) => {
      try {
        return DexSwapQuoteSchema.parse(data)
      } catch (e) {
        console.error(e)
        throw e
      }
    })
  }
