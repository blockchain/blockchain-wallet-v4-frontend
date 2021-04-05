import { selectors } from 'data'

import { Props } from './template.success'

export const maximumAmount = (value: string, allValues, restProps: Props) => {
  if (!value) return true

  const { fees, withdrawableBalance } = restProps

  if (!withdrawableBalance) return true

  const maxAmount = Number(withdrawableBalance) - Number(fees.value)

  return Number(value) > maxAmount ? 'ABOVE_MAX' : false
}

export const minimumAmount = (value: string, allValues, restProps: Props) => {
  if (!value) return true

  const minAmount =
    Number(restProps.minAmount.value) ||
    selectors.components.withdraw.MIN_AMOUNT

  if (Number(value) === minAmount) return false

  return Number(value) < minAmount ? 'BELOW_MIN' : false
}
