import React from 'react'
import { FormattedMessage } from 'react-intl'

import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { FiatType } from 'blockchain-wallet-v4/src/types'
import { convertBaseToStandard } from 'data/components/exchange/services'

import { ValidateProps as Props } from '.'

export const maximumAmount = (value: string, allValues, restProps: Props) => {
  const max = convertBaseToStandard('FIAT', restProps.depositLimits.max)
  const formattedMax = fiatToString({
    value: max,
    unit: allValues.currency || ('USD' as FiatType)
  })
  return Number(value) > Number(max) ? (
    <FormattedMessage
      id='copy.forms.amount_max'
      defaultMessage='The maximum amount is {amount}'
      values={{
        amount: formattedMax
      }}
    />
  ) : (
    undefined
  )
}

export const minimumAmount = (value: string, allValues, restProps: Props) => {
  const min = convertBaseToStandard('FIAT', restProps.depositLimits.min)
  const formattedMin = fiatToString({
    value: min,
    unit: allValues.currency || ('USD' as FiatType)
  })
  return Number(value) < Number(min) ? (
    <FormattedMessage
      id='copy.forms.amount_min'
      defaultMessage='The minimum amount is {amount}'
      values={{
        amount: formattedMin
      }}
    />
  ) : (
    undefined
  )
}
