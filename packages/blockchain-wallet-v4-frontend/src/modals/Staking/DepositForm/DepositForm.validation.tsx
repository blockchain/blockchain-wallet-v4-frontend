import BigNumber from 'bignumber.js'

import { Props } from './DepositForm.template.success'

export const minDepositAmount = (value, allValues, props: Props) => {
  if (!value) return true
  const minDeposit = props.displayCoin
    ? props.interestDepositLimits.minCoin
    : props.interestDepositLimits.minFiat
  return new BigNumber(value).isLessThan(minDeposit) ? 'BELOW_MIN' : false
}

export const maxDepositAmount = (value, allValues, props: Props) => {
  if (!value) return true
  const maxDeposit = props.displayCoin
    ? props.interestDepositLimits.maxCoin
    : props.interestDepositLimits.maxFiat

  return new BigNumber(maxDeposit).isLessThan(value) ? 'ABOVE_MAX' : false
}
