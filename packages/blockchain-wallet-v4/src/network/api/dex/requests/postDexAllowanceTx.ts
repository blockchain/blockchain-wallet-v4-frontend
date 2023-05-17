import { CoinType } from '@core/types'

import type { RequestConfig } from '../../http'
import { DEX_NABU_GATEWAY_PREFIX } from '../constants'
// import type { DexPostAllowanceTxResponse } from '../types'

type Data = {
  intent: {
    destination: string
    fee: 'NORMAL'
    maxVerificationVersion: 1
    sources: {
      decriptor: 'legacy'
      pubKey: string
      style: 'SINGLE'
    }[]
    spender: 'ZEROX_EXCHANGE'
    swapTx: {
      data: string
      gasLimit: string
      value: string
    }
    type: 'TOKEN_APPROVAL'
  }
  network: 'ETH'
}

export const postDexTokenAllowanceTx =
  ({
    apiUrl,
    authorizedPost
  }: {
    apiUrl: string
    authorizedPost: (config: RequestConfig) => Promise<unknown>
  }) =>
  (data: Data) =>
    authorizedPost({
      contentType: 'application/json',
      data,
      endPoint: `/currency/evm/buildTx`,
      removeDefaultPostData: true,
      url: apiUrl
    })
