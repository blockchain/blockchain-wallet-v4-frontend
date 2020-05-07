import { convertBaseToStandard } from 'data/components/exchange/services'
import { SBCheckoutFormValuesType } from 'data/types'
import BigNumber from 'bignumber.js'

export const getMaxMin = (
  allValues?: SBCheckoutFormValuesType,
  minOrMax?: 'min' | 'max'
) => {
  switch (minOrMax || 'max') {
    case 'max':
      const defaultMax = convertBaseToStandard('FIAT', 0)
      if (!allValues) return defaultMax
      if (!allValues.method) return defaultMax
      if (!allValues.pair) return defaultMax

      const max = BigNumber.minimum(
        allValues.method.limits.max,
        allValues.pair.buyMax
      ).toString()

      return convertBaseToStandard('FIAT', max)
    case 'min':
      const defaultMin = convertBaseToStandard('FIAT', 0)
      if (!allValues) return defaultMin
      if (!allValues.method) return defaultMin
      if (!allValues.pair) return defaultMin

      const min = BigNumber.maximum(
        allValues.method.limits.min,
        allValues.pair.buyMin
      ).toString()

      return convertBaseToStandard('FIAT', min)
  }
}

export const maximumAmount = (
  value: string,
  allValues: SBCheckoutFormValuesType
) => {
  if (!allValues.pair) return
  if (!value) return true
  return Number(value) > Number(getMaxMin(allValues, 'max'))
    ? 'ABOVE_MAX'
    : false
}

export const minimumAmount = (
  value: string,
  allValues: SBCheckoutFormValuesType
) => {
  if (!allValues.pair) return
  if (!value) return true
  return Number(value) < Number(getMaxMin(allValues, 'min'))
    ? 'BELOW_MIN'
    : false
}
