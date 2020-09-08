import { Props } from './template.success'

export const MIN_AMOUNT = 1000

export const maximumAmount = (value: string, allValues, restProps: Props) => {
  if (!value) return true

  const { balance } = restProps

  if (!balance) return true

  return Number(value) > Number(balance) ? 'ABOVE_MAX' : false
}

export const minimumAmount = (value: string) => {
  if (!value) return true

  if (Number(value) === MIN_AMOUNT) return false

  return Number(value) < MIN_AMOUNT ? 'BELOW_MIN' : false
}
