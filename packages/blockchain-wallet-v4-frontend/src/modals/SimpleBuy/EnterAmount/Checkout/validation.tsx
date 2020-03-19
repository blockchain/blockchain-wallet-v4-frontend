import { Props } from '../template.success'
import { SBCheckoutFormValuesType } from 'data/types'

export const maximumAmount = (
  value: string,
  allValues: SBCheckoutFormValuesType,
  props: Props
) => {
  if (!allValues.pair) return
  if (!value) return true
  return Number(value) > Number(allValues.pair.buyMax) ? 'Above max' : false
}

export const minimumAmount = (
  value: string,
  allValues: SBCheckoutFormValuesType,
  props: Props
) => {
  if (!allValues.pair) return
  if (!value) return true
  return Number(value) < Number(allValues.pair.buyMin) ? 'Below min' : false
}
