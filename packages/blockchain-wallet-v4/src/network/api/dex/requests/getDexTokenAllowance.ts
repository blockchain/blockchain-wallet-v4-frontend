import { CoinType } from '@core/types'

import type { RequestConfig } from '../../http'
import { DEX_NABU_GATEWAY_PREFIX } from '../constants'
import { DexTokenAllowanceSchema } from '../schemas'
import type { DexTokenAllowance } from '../types'

type Data = {
  addressOwner: string
  currency: string
  network: string
  spender: string
}

export const getDexTokenAllowance =
  ({
    apiUrl,
    authorizedPost
  }: {
    apiUrl: string
    authorizedPost: (config: RequestConfig) => Promise<unknown>
  }) =>
  (data: Data): Promise<DexTokenAllowance> =>
    authorizedPost({
      contentType: 'application/json',
      data,
      endPoint: `${DEX_NABU_GATEWAY_PREFIX}/currency/evm/buildTx`,
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
