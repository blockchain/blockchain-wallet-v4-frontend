import BigNumber from 'bignumber.js'

import { Props } from './template.success'

export const minDepositAmount = (value, allValues, props: Props) => {
  if (!value) return true

  return new BigNumber(value).isLessThan(props.depositLimits.minFiat)
    ? 'BELOW_MIN'
    : false
}
export const maxDepositAmount = (value, allValues, props: Props) => {
  if (!value) return true

  return new BigNumber(props.depositLimits.maxFiat).isLessThan(value)
    ? 'ABOVE_MAX'
    : false
}
