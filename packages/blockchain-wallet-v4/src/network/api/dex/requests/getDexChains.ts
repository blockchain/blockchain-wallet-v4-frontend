import type { RequestConfig } from '../../http'
import { DEX_GATEWAY_PREFIX } from '../constants'
import { DexChainSchema, listSchema } from '../schemas'
import type { DexChain } from '../types'

export const getDexChains =
  ({ apiUrl, get }: { apiUrl: string; get: (config: RequestConfig) => Promise<unknown> }) =>
  (): Promise<DexChain[]> =>
    get({
      contentType: 'application/json',
      endPoint: `${DEX_GATEWAY_PREFIX}/chains`,
      url: apiUrl
    }).then((data) => {
      try {
        return listSchema(DexChainSchema).parse(data)
      } catch (e) {
        console.error(e)
        throw e
      }
    })
