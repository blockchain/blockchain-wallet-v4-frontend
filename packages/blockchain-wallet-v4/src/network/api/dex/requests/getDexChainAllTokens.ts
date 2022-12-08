import type { RequestConfig } from '../../http'
import { DEX_GATEWAY_PREFIX } from '../constants'
import { DexTokenSchema, listSchema } from '../schemas'
import type { DexToken } from '../types'

export const getDexChainAllTokens =
  ({ apiUrl, post }: { apiUrl: string; post: (config: RequestConfig) => Promise<unknown> }) =>
  (chainId: number): Promise<DexToken[]> =>
    post({
      contentType: 'application/json',
      data: {
        chainId,
        queryBy: 'ALL'
      },
      endPoint: `${DEX_GATEWAY_PREFIX}/tokens`,
      removeDefaultPostData: true,
      url: apiUrl
    }).then((data) => listSchema(DexTokenSchema).parse(data))
