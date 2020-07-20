import { convertBaseToStandard } from 'data/components/exchange/services'
import { SBCheckoutFormValuesType } from 'data/types'
import { SBPairType, SBPaymentMethodType } from 'core/types'
import BigNumber from 'bignumber.js'

export const getMaxMin = (
  pair: SBPairType,
  minOrMax?: 'min' | 'max',
  allValues?: SBCheckoutFormValuesType,
  method?: SBPaymentMethodType
) => {
  switch (minOrMax || 'max') {
    case 'max':
      const defaultMax = convertBaseToStandard('FIAT', 0)
      if (!allValues) return defaultMax
      if (!method) return defaultMax
      if (!pair) return defaultMax

      const max = BigNumber.minimum(method.limits.max, pair.buyMax).toString()

      return convertBaseToStandard('FIAT', max)
    case 'min':
      const defaultMin = convertBaseToStandard('FIAT', 0)
      if (!allValues) return defaultMin
      if (!method) return defaultMin
      if (!pair) return defaultMin

      const min = BigNumber.maximum(method.limits.min, pair.buyMin).toString()

      return convertBaseToStandard('FIAT', min)
  }
}

export const maximumAmount = (
  value: string,
  allValues: SBCheckoutFormValuesType,
  pair: SBPairType,
  method?: SBPaymentMethodType
) => {
  if (!value) return true
  if (!method) return true
  return Number(value) > Number(getMaxMin(pair, 'max', allValues))
    ? 'ABOVE_MAX'
    : false
}

export const minimumAmount = (
  value: string,
  allValues: SBCheckoutFormValuesType,
  pair: SBPairType,
  method?: SBPaymentMethodType
) => {
  if (!value) return true
  if (!method) return true
  return Number(value) < Number(getMaxMin(pair, 'min', allValues))
    ? 'BELOW_MIN'
    : false
}
