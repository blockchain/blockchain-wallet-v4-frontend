import { convertBaseToStandard } from 'data/components/exchange/services'
import { fiatToString } from 'core/exchange/currency'
import { FiatType } from 'core/types'

import { Props } from './template.success'

export const maximumAmount = (value: string, allValues, restProps: Props) => {
  const max = convertBaseToStandard('FIAT', restProps.depositLimits.max)
  const formattedMax = fiatToString({
    value: max,
    unit: allValues.currency || ('USD' as FiatType)
  })
  return Number(value) > Number(max)
    ? `Your Maximum Amount is ${formattedMax}`
    : undefined
}

export const minimumAmount = (value: string, allValues, restProps: Props) => {
  const min = convertBaseToStandard('FIAT', restProps.depositLimits.min)
  const formattedMin = fiatToString({
    value: min,
    unit: allValues.currency || ('USD' as FiatType)
  })
  return Number(value) < Number(min)
    ? `Your Minimum Amount is ${formattedMin}`
    : undefined
}
