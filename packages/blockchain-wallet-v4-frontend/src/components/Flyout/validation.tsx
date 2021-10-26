import React from 'react'
import { FormattedMessage } from 'react-intl'

import { fiatToString } from '@core/exchange/utils'
import { FiatType } from '@core/types'
import { convertBaseToStandard } from 'data/components/exchange/services'

export const minMaxAmount = (limits: { max: string; min: string }, amount: string) => {
  const max = convertBaseToStandard('FIAT', limits.max)
  const min = convertBaseToStandard('FIAT', limits.min)
  const formattedMax = fiatToString({
    unit: 'USD' as FiatType,
    value: max
  })
  const formattedMin = fiatToString({
    unit: 'USD' as FiatType,
    value: min
  })
  // This handles the default case where we show "0" in the input field but
  // it's just a placeholder and amount actuall equals '' in redux
  if (amount === '') return undefined
  // The min max logic
  if (Number(amount) > Number(max)) {
    return {
      amount: (
        <FormattedMessage
          id='copy.forms.amount_max'
          defaultMessage='The maximum amount is {amount}'
          values={{
            amount: formattedMax
          }}
        />
      )
    }
  }
  if (Number(amount) < Number(min)) {
    return {
      amount: (
        <FormattedMessage
          id='copy.forms.amount_min'
          defaultMessage='The minimum amount is {amount}'
          values={{
            amount: formattedMin
          }}
        />
      )
    }
  }
}
