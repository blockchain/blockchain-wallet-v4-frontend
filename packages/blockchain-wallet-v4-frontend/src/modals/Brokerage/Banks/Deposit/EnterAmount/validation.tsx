import React from 'react'
import { FormattedMessage } from 'react-intl'

import { fiatToString } from '@core/exchange/utils'
import { FiatType } from '@core/types'
import { convertBaseToStandard } from 'data/components/exchange/services'

import { ValidateProps as Props } from '.'

export const maximumAmount = (value: string, allValues, restProps: Props) => {
  const max = convertBaseToStandard('FIAT', restProps.depositLimits.max)
  const formattedMax = fiatToString({
    unit: allValues.currency || ('USD' as FiatType),
    value: max
  })
  return Number(value) > Number(max) ? (
    <FormattedMessage
      id='copy.forms.amount_max'
      defaultMessage='The maximum amount is {amount}'
      values={{
        amount: formattedMax
      }}
    />
  ) : undefined
}

export const minimumAmount = (value: string, allValues, restProps: Props) => {
  const min = convertBaseToStandard('FIAT', restProps.depositLimits.min)
  const formattedMin = fiatToString({
    unit: allValues.currency || ('USD' as FiatType),
    value: min
  })
  return Number(value) < Number(min) ? (
    <FormattedMessage
      id='copy.forms.amount_min'
      defaultMessage='The minimum amount is {amount}'
      values={{
        amount: formattedMin
      }}
    />
  ) : undefined
}
