import BigNumber from 'bignumber.js'

import { SuccessPropsType } from './DepositForm.types'

export const minDepositAmount = (value, allValues, props: SuccessPropsType) => {
  if (!value) return true
  const minDeposit = props.displayCoin
    ? props.earnDepositLimits.minCoin
    : props.earnDepositLimits.minFiat
  return new BigNumber(value).isLessThan(minDeposit) ? 'BELOW_MIN' : false
}

export const maxDepositAmount = (value, allValues, props: SuccessPropsType) => {
  if (!value) return true
  const maxDeposit = props.displayCoin
    ? props.earnDepositLimits.maxCoin
    : props.earnDepositLimits.maxFiat

  return new BigNumber(maxDeposit).isLessThan(value) ? 'ABOVE_MAX' : false
}
