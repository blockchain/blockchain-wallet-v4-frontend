import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const btcFeeR = selectors.core.data.bitcoin.getFee(state)
  const ethFeeR = selectors.core.data.ethereum.getFee(state)

  return lift((btcFee, ethFee) => ({ btcFee, ethFee }))(btcFeeR, ethFeeR)
}
