import BigNumber from 'bignumber.js'

import { Props } from './template.success'

export const minDepositAmount = (value, allValues, props: Props) => {
  if (!value) return true
  if (props.displayCoin) {
    return new BigNumber(value).isLessThan(props.depositLimits.minCoin)
      ? 'BELOW_MIN'
      : false
  } else {
    return new BigNumber(value).isLessThan(props.depositLimits.minFiat)
      ? 'BELOW_MIN'
      : false
  }
}
export const maxDepositAmount = (value, allValues, props: Props) => {
  if (!value) return true
  if (props.displayCoin) {
    return new BigNumber(props.depositLimits.maxCoin).isLessThan(value)
      ? 'ABOVE_MAX'
      : false
  } else {
    return new BigNumber(props.depositLimits.maxFiat).isLessThan(value)
      ? 'ABOVE_MAX'
      : false
  }
}
