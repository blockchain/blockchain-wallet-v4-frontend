import { convertBaseToStandard } from 'data/components/exchange/services'
import { SBCheckoutFormValuesType } from 'data/types'
import BigNumber from 'bignumber.js'

import { SBPairType } from 'core/types'

export const getMaxMin = (
  pair: SBPairType,
  minOrMax?: 'min' | 'max',
  allValues?: SBCheckoutFormValuesType
) => {
  switch (minOrMax || 'max') {
    case 'max':
      const defaultMax = convertBaseToStandard('FIAT', 0)
      if (!allValues) return defaultMax
      if (!allValues.method) return defaultMax
      if (!pair) return defaultMax

      const max = BigNumber.minimum(
        allValues.method.limits.max,
        pair.buyMax
      ).toString()

      return convertBaseToStandard('FIAT', max)
    case 'min':
      const defaultMin = convertBaseToStandard('FIAT', 0)
      if (!allValues) return defaultMin
      if (!allValues.method) return defaultMin
      if (!pair) return defaultMin

      const min = BigNumber.maximum(
        allValues.method.limits.min,
        pair.buyMin
      ).toString()

      return convertBaseToStandard('FIAT', min)
  }
}

export const maximumAmount = (
  value: string,
  allValues: SBCheckoutFormValuesType,
  pair: SBPairType
) => {
  if (!value) return true
  return Number(value) > Number(getMaxMin(pair, 'max', allValues))
    ? 'ABOVE_MAX'
    : false
}

export const minimumAmount = (
  value: string,
  allValues: SBCheckoutFormValuesType,
  pair: SBPairType
) => {
  if (!value) return true
  return Number(value) < Number(getMaxMin(pair, 'min', allValues))
    ? 'BELOW_MIN'
    : false
}
