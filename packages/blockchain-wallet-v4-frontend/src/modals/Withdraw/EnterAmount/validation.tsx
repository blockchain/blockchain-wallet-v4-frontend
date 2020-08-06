import { Props } from './template.success'

export const maximumAmount = (value: string, allValues, restProps: Props) => {
  if (!value) return true

  const { balance } = restProps

  if (!balance) return true

  return Number(value) > Number(balance) ? 'ABOVE_MAX' : false
}
