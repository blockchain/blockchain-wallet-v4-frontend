import type { RequestConfig } from '../../http'
import { DexTokenAllowanceSchema } from '../schemas'
import type { DexTokenAllowance } from '../types'

type Data = {
  addressOwner: string
  currency: string
  network: string
  spender: string
}

export const getDexTokenAllowance =
  ({ apiUrl, post }: { apiUrl: string; post: (config: RequestConfig) => Promise<unknown> }) =>
  (data: Data): Promise<DexTokenAllowance> =>
    post({
      contentType: 'application/json',
      data,
      endPoint: `/currency/evm/allowance`,
      removeDefaultPostData: true,
      url: apiUrl
    }).then((data) => {
      try {
        return DexTokenAllowanceSchema.parse(data)
      } catch (e) {
        console.error(e)
        throw e
      }
    })
