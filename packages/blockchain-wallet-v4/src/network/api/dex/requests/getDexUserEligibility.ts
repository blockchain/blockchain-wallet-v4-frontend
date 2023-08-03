import type { RequestConfig } from '../../http'
import { DexUserEligibilitySchema } from '../schemas'

export const getDexUserEligibility =
  ({
    authorizedGet,
    nabuUrl
  }: {
    authorizedGet: (config: RequestConfig) => Promise<unknown>
    nabuUrl: string
  }) =>
  (): Promise<boolean> =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: `/products`,
      url: nabuUrl
    }).then((data) => {
      try {
        return DexUserEligibilitySchema.parse(data)
      } catch (e) {
        console.error(e)
        throw e
      }
    })
