import type { CancelToken } from 'axios'

import type { RequestConfig } from '../../http'
import { DEX_GATEWAY_PREFIX } from '../constants'
import { DexTokenSchema, listSchema } from '../schemas'
import type { DexToken } from '../types'

type Params = {
  cancelToken: CancelToken | undefined
  offset: number
}

export const getDexChainTokens =
  ({ apiUrl, get }: { apiUrl: string; get: (config: RequestConfig) => Promise<unknown> }) =>
  (chainId: number, params: Params): Promise<DexToken[]> => {
    return get({
      // TODO: Migrate to AbortController after axios upgrade > 0.22.0
      cancelToken: params.cancelToken,
      contentType: 'application/json',
      endPoint: `${DEX_GATEWAY_PREFIX}/tokens?chainId=${chainId}&queryBy=ALL&offset=${params.offset}&limit=50`,
      ignoreQueryParams: true,
      removeDefaultPostData: true,
      url: apiUrl
    }).then((data) => {
      try {
        return listSchema(DexTokenSchema).parse(data)
      } catch (e) {
        console.error(e)
        throw e
      }
    })
  }
