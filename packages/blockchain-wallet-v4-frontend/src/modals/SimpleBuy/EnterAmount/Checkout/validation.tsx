import { convertBaseToStandard } from 'data/components/exchange/services'
import { Props } from './template.success'
import { SBBalancesType, SBPairType, SBPaymentMethodType } from 'core/types'
import { SBCheckoutFormValuesType } from 'data/types'
import BigNumber from 'bignumber.js'

export const getMaxMin = (
  pair: SBPairType,
  minOrMax: 'min' | 'max',
  sbBalances: SBBalancesType,
  allValues?: SBCheckoutFormValuesType,
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
        max = sbBalances[method.currency]?.available || '0'

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

  const { pair, method: selectedMethod, defaultMethod, sbBalances } = restProps
  const method = selectedMethod || defaultMethod
  if (!method) return true

  return Number(value) >
    Number(getMaxMin(pair, 'max', sbBalances, allValues, method))
    ? 'ABOVE_MAX'
    : false
}

export const minimumAmount = (
  value: string,
  allValues: SBCheckoutFormValuesType,
  restProps: Props
) => {
  if (!value) return true

  const { pair, method: selectedMethod, defaultMethod, sbBalances } = restProps
  const method = selectedMethod || defaultMethod
  if (!method) return true

  return Number(value) <
    Number(getMaxMin(pair, 'min', sbBalances, allValues, method))
    ? 'BELOW_MIN'
    : false
}
