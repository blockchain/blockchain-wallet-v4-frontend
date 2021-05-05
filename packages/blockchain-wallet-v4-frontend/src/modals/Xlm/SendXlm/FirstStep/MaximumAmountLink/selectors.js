import BigNumber from 'bignumber.js'
import { prop } from 'ramda'

import { Exchange } from 'blockchain-wallet-v4/src'

export const getData = (state, props) => {
  const fee = prop('fee', props)
  const feeXlm = Exchange.convertCoinToCoin({
    value: fee,
    coin: 'XLM'
  })
  const effectiveBalanceXlm = prop('effectiveBalanceXlm', props)
  return {
    effectiveBalance: new BigNumber(effectiveBalanceXlm)
      .minus(feeXlm)
      .toString()
  }
}
