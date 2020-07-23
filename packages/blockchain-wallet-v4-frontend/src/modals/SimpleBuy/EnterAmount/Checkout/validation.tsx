import { convertBaseToStandard } from 'data/components/exchange/services'
import { Props } from './template.success'
import { SBBalancesType, SBPairType, SBPaymentMethodType } from 'core/types'
import { SBCheckoutFormValuesType } from 'data/types'
import BigNumber from 'bignumber.js'

export const getMaxMin = (
  pair: SBPairType,
  minOrMax: 'min' | 'max',
  allValues: SBCheckoutFormValuesType,
  sbBalances: SBBalancesType,
  method?: SBPaymentMethodType
) => {
  switch (minOrMax || 'max') {
    case 'max':
      const defaultMax = convertBaseToStandard('FIAT', 0)
      if (!allValues) return defaultMax
      if (!method) return defaultMax
      if (!pair) return defaultMax

      let max = BigNumber.minimum(method.limits.max, pair.buyMax).toString()

      if (method.type === 'FUNDS' && sbBalances)
        max = sbBalances[method.currency].available

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
  restProps: Props
) => {
  if (!value) return true

  const { pair, method, sbBalances } = restProps
  if (!method) return true

  return Number(value) >
    Number(getMaxMin(pair, 'max', allValues, sbBalances, method))
    ? 'ABOVE_MAX'
    : false
}

export const minimumAmount = (
  value: string,
  allValues: SBCheckoutFormValuesType,
  restProps: Props
) => {
  if (!value) return true

  const { pair, method, sbBalances } = restProps
  if (!method) return true

  return Number(value) <
    Number(getMaxMin(pair, 'min', allValues, sbBalances, method))
    ? 'BELOW_MIN'
    : false
}
