import { BuildDexTx } from '@core/network/api/dex/types'

import { ParsedTx } from '../types'

export const parseRawTx = (tx: BuildDexTx): ParsedTx => {
  const {
    rawTx: { payload }
  } = tx
  const { chainId, data, gasLimit, gasPrice, nonce, to, value } = payload

  return {
    chainId,
    data,
    gasLimit,
    gasPrice,
    nonce,
    to,
    value
  }
}
