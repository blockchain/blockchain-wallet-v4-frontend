import BigNumber from 'bignumber.js'

import {
  BSBalancesType,
  BSPairType,
  BSPaymentMethodType,
  BSPaymentTypes,
  PaymentValue,
  SwapUserLimitsType
} from '@core/types'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { components } from 'data/model'
import { BSCheckoutFormValuesType, SwapAccountType } from 'data/types'

import { Props } from './template.success'
import { Limits } from './types'

// TODO remove not used properties
export const getMaxMin = (
  minOrMax: 'min' | 'max',
  sbBalances: BSBalancesType,
  pair: BSPairType,
  payment?: PaymentValue,
  allValues?: BSCheckoutFormValuesType,
  method?: BSPaymentMethodType,
  account?: SwapAccountType,
  limits?: SwapUserLimitsType
): { type?: Limits; value: string } => {
  let limitType = Limits.ABOVE_MAX
  switch (minOrMax) {
    case 'max':
      // we need minimum of all max amounts including limits
      let limitMaxAmount = Number(pair.buyMax)
      let limitMaxChanged = false
      if (limits?.maxOrder) {
        const buyMaxItem = Number(limitMaxAmount)
        // 1000.00 => 100000 since all other amounts are in base we do convert this in base
        const maxOrderBase = convertBaseToStandard('FIAT', limits.maxOrder, false)

        const baseMaxLimitAmount = Number(maxOrderBase)
        if (baseMaxLimitAmount < buyMaxItem) {
          limitMaxAmount = baseMaxLimitAmount
          limitMaxChanged = true
        }
      }

      const defaultMax = {
        type: limitType,
        value: convertBaseToStandard('FIAT', pair.buyMax)
      }

      // we have to convert in case that this amount is from maxOrder
      // we have to convert it to Standard since defaultMax is in standard format
      const defaultMaxCompare = limitMaxChanged
        ? Number(convertBaseToStandard('FIAT', limitMaxAmount))
        : limitMaxAmount
      if (Number(defaultMax.value) > defaultMaxCompare && limitMaxChanged) {
        defaultMax.value = String(defaultMaxCompare)
      }

      if (!allValues) return defaultMax
      if (!method) return defaultMax

      let max = BigNumber.minimum(method.limits.max, pair.buyMax, limitMaxAmount).toString()

      let fundsChangedMax = false
      if (method.type === BSPaymentTypes.FUNDS && sbBalances && limits?.maxPossibleOrder) {
        const available = sbBalances[method.currency]?.available || '0'
        // available is always in minor string
        const availableStandard = available ? convertBaseToStandard('FIAT', available) : available
        switch (true) {
          case !availableStandard:
          default:
            max = '0'
            break
          case Number(availableStandard) >= Number(limits.maxPossibleOrder):
            max = limits.maxPossibleOrder
            limitType = Limits.ABOVE_LIMIT
            fundsChangedMax = true
            break
          case Number(availableStandard) < Number(limits.maxPossibleOrder):
            max = availableStandard
            limitType = Limits.ABOVE_BALANCE
            fundsChangedMax = true
            break
        }
      }

      const maxFiat = !fundsChangedMax ? convertBaseToStandard('FIAT', max) : max

      return { type: limitType, value: maxFiat }
    case 'min':
      // we need maximum of all min amounts including limits
      let limitMinAmount = Number(pair.buyMin)
      let limitMinChanged = false
      if (limits?.minOrder) {
        const minOrderBase = convertBaseToStandard('FIAT', limits.minOrder, false)
        const baseMinLimitAmount = Number(minOrderBase)
        if (baseMinLimitAmount > limitMinAmount) {
          limitMinAmount = baseMinLimitAmount
          limitMinChanged = true
        }
      }

      const defaultMin = {
        value: convertBaseToStandard('FIAT', pair.buyMin)
      }

      const defaultMinCompare = limitMinChanged
        ? Number(convertBaseToStandard('FIAT', limitMinAmount))
        : limitMinAmount
      if (Number(defaultMin.value) < defaultMinCompare && limitMinChanged) {
        defaultMin.value = String(defaultMinCompare)
      }

      if (!allValues) return defaultMin
      if (!method) return defaultMin

      const min = BigNumber.maximum(method.limits.min, pair.buyMin, limitMinAmount).toString()

      const minFiat = convertBaseToStandard('FIAT', min)

      return { value: minFiat }
    default:
      return { value: '0' }
  }
}

export const maximumAmount = (
  value: string,
  allValues: BSCheckoutFormValuesType,
  restProps: Props
): boolean | string => {
  if (!value) return true

  const {
    defaultMethod,
    limits,
    method: selectedMethod,
    pair,
    payment,
    sbBalances,
    swapAccount
  } = restProps

  const method = selectedMethod || defaultMethod
  if (!allValues) return false

  const maxMinAmount = getMaxMin(
    'max',
    sbBalances,
    pair,
    payment,
    allValues,
    method,
    swapAccount,
    limits
  )
  const errorType = maxMinAmount.type || Limits.ABOVE_MAX
  return Number(value) > Number(maxMinAmount[allValues.fix]) ? errorType : false
}

export const minimumAmount = (
  value: string,
  allValues: BSCheckoutFormValuesType,
  restProps: Props
): boolean | string => {
  if (!value) return true

  const {
    defaultMethod,
    limits,
    method: selectedMethod,
    pair,
    payment,
    sbBalances,
    swapAccount
  } = restProps
  const method = selectedMethod || defaultMethod
  if (!allValues) return false
  return Number(value) <
    Number(
      getMaxMin('min', sbBalances, pair, payment, allValues, method, swapAccount, limits)[
        allValues.fix
      ]
    )
    ? 'BELOW_MIN'
    : false
}

export const checkCrossBorderLimit = (
  value: string,
  allValues: BSCheckoutFormValuesType,
  props: Props
): boolean | string => {
  const { crossBorderLimits } = props

  if (!crossBorderLimits?.current) {
    return false
  }

  const { value: availableAmount } = crossBorderLimits?.current?.available
  const availableAmountInBase = convertBaseToStandard('FIAT', availableAmount)

  return Number(value) > Number(availableAmountInBase) ? 'ABOVE_MAX_LIMIT' : false
}
