import type { CancelToken } from 'axios'

import type { RequestConfig } from '../../http'
import { DEX_GATEWAY_PREFIX } from '../constants'
import { DexTokenSchema, listSchema } from '../schemas'
import type { DexToken } from '../types'

export const getDexChainAllTokens =
  ({ apiUrl, post }: { apiUrl: string; post: (config: RequestConfig) => Promise<unknown> }) =>
  (chainId: number, search: string, cancelToken: CancelToken): Promise<DexToken[]> =>
    post({
      // TODO: Migrate to AbortController after axios upgrade > 0.22.0
      cancelToken,
      contentType: 'application/json',
      data: {
        chainId,
        query: search,
        queryBy: 'MIXED'
      },
      endPoint: `${DEX_GATEWAY_PREFIX}/tokens`,
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
