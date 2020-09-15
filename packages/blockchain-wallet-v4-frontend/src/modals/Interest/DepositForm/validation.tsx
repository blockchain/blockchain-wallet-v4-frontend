import BigNumber from 'bignumber.js'

import { Props } from './template.success'

export const minDepositAmount = (value, allValues, props: Props) => {
  if (!value) return true
  const minDeposit = props.displayCoin
    ? props.depositLimits.minCoin
    : props.depositLimits.minFiat
  return new BigNumber(value).isLessThan(minDeposit) ? 'BELOW_MIN' : false
}

export const maxDepositAmount = (value, allValues, props: Props) => {
  if (!value) return true
  const maxDeposit = props.displayCoin
    ? props.depositLimits.maxCoin
    : props.depositLimits.maxFiat

  return new BigNumber(maxDeposit).isLessThan(value) ? 'ABOVE_MAX' : false
}
