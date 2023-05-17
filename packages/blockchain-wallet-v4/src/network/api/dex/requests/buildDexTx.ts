import type { RequestConfig } from '../../http'
import { DEX_NABU_GATEWAY_PREFIX } from '../constants'
import { BuildDexTxSchema } from '../schemas'
import type { BuildDexTx, BuildDexTxParams } from '../types'

export const buildDexTx =
  ({
    apiUrl,
    authorizedPost
  }: {
    apiUrl: string
    authorizedPost: (config: RequestConfig) => Promise<unknown>
  }) =>
  (data: BuildDexTxParams): Promise<BuildDexTx> =>
    authorizedPost({
      contentType: 'application/json',
      data,
      endPoint: `${DEX_NABU_GATEWAY_PREFIX}/currency/evm/buildTx`,
      removeDefaultPostData: true,
      url: apiUrl
    }).then((data) => {
      try {
        return BuildDexTxSchema.parse(data)
      } catch (e) {
        console.error(e)
        throw e
      }
    })
