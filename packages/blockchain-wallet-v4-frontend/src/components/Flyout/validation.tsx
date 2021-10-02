import React from 'react'
import { FormattedMessage } from 'react-intl'

import { fiatToString } from '@core/exchange/utils'
import { FiatType } from '@core/types'
import { convertBaseToStandard } from 'data/components/exchange/services'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
export const maximumAmount = (maxAmount) => (values: { amount: string }) => {
  const max = convertBaseToStandard('FIAT', maxAmount)
  const min = convertBaseToStandard('FIAT', '1000')
  const formattedMax = fiatToString({
    unit: 'USD' as FiatType,
    value: max
  })
  const formattedMin = fiatToString({
    unit: 'USD' as FiatType,
    value: min
  })
  return sleep(0).then(() => {
    /* eslint-disable no-throw-literal */
    if (Number(values.amount) > Number(max)) {
      throw {
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
    } else if (Number(values.amount) === 0) {
      return undefined
    } else if (Number(values.amount) < Number(min)) {
      throw {
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
    /* eslint-enable no-throw-literal */
  })
}

export const minimumAmount = (minAmount) => (value: string, allValues) => {
  const min = convertBaseToStandard('FIAT', minAmount)
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
