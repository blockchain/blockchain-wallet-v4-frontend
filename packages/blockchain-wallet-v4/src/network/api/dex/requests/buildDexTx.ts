import type { RequestConfig } from '../../http'
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
      endPoint: `/currency/evm/buildTx`,
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
