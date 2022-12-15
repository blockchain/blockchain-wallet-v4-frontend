import type { RequestConfig } from '../../http'
import { DEX_NABU_GATEWAY_PREFIX } from '../constants'
import { DexUserEligibilitySchema } from '../schemas'

export const getDexUserEligibility =
  ({
    apiUrl,
    authorizedGet
  }: {
    apiUrl: string
    authorizedGet: (config: RequestConfig) => Promise<unknown>
  }) =>
  ({ walletAddress }: { walletAddress: string }): Promise<boolean> =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: `${DEX_NABU_GATEWAY_PREFIX}/eligible`,
      params: { product: 'DEX', walletAddress },
      url: apiUrl
    }).then((data) => {
      try {
        return DexUserEligibilitySchema.parse(data)
      } catch (e) {
        console.error(e)
        throw e
      }
    })
