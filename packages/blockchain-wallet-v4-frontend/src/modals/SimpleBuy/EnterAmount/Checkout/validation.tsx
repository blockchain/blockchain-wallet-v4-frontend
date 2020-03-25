import { convertBaseToStandard } from 'data/components/exchange/services'
import { Props } from '../template.success'
import { SBCheckoutFormValuesType } from 'data/types'

export const maximumAmount = (
  value: string,
  allValues: SBCheckoutFormValuesType,
  props: Props
) => {
  if (!allValues.pair) return
  if (!value) return true
  return Number(value) >
    Number(convertBaseToStandard('FIAT', allValues.pair.buyMax))
    ? 'ABOVE_MAX'
    : false
}

export const minimumAmount = (
  value: string,
  allValues: SBCheckoutFormValuesType,
  props: Props
) => {
  if (!allValues.pair) return
  if (!value) return true
  return Number(value) <
    Number(convertBaseToStandard('FIAT', allValues.pair.buyMin))
    ? 'BELOW_MIN'
    : false
}
