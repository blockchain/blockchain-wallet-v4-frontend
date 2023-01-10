import type { CancelToken } from 'axios'

import type { RequestConfig } from '../../http'
import { DEX_GATEWAY_PREFIX } from '../constants'
import { DexTokenSchema, listSchema } from '../schemas'
import type { DexToken } from '../types'

type Params = {
  cancelToken: CancelToken | undefined
  offset: number
  search: string
}

type QueryParameters = {
  offset?: number
  query?: string
}

export const getDexChainTokens =
  ({ apiUrl, post }: { apiUrl: string; post: (config: RequestConfig) => Promise<unknown> }) =>
  (chainId: number, params: Params): Promise<DexToken[]> => {
    const queryParams: QueryParameters = {
      offset: params.offset,
      query: params.search
    }

    return post({
      // TODO: Migrate to AbortController after axios upgrade > 0.22.0
      cancelToken: params.cancelToken,
      contentType: 'application/json',
      data: {
        chainId,
        queryBy: 'MIXED',
        ...queryParams
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
  }
