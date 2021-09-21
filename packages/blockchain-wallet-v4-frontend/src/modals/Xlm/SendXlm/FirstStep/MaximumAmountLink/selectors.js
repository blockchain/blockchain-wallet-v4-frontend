import BigNumber from 'bignumber.js'
import { prop } from 'ramda'

import { Exchange } from '@core'

export const getData = (state, props) => {
  const fee = prop('fee', props)
  const feeXlm = Exchange.convertCoinToCoin({
    coin: 'XLM',
    value: fee
  })
  const effectiveBalanceXlm = prop('effectiveBalanceXlm', props)
  return {
    effectiveBalance: new BigNumber(effectiveBalanceXlm).minus(feeXlm).toString()
  }
}
