import React from 'react'
import { FormattedMessage } from 'react-intl'

import { MAX_ALLOWED_SLIPPAGE, MIN_ALLOWED_SLIPPAGE } from './constants'

const validateIsNumber = (value: string): boolean => {
  if (value.match(/^-?\d+$/) || value.match(/^\d+\.\d+$/)) {
    return true
  }
  return false
}

const validateMin = (value: number) => {
  if (!value) return
  if (value < MIN_ALLOWED_SLIPPAGE)
    return (
      <FormattedMessage
        id='dex.settings.invalid_min_slippage_percentage'
        defaultMessage='Value must be greater than {limit}%'
        values={{
          limit: MIN_ALLOWED_SLIPPAGE * 100
        }}
      />
    )
}

const validateMax = (value: number) => {
  if (!value) return
  if (value > MAX_ALLOWED_SLIPPAGE)
    return (
      <FormattedMessage
        id='dex.settings.invalid_max_slippage_percentage'
        defaultMessage='Value must be less than {limit}%'
        values={{
          limit: MAX_ALLOWED_SLIPPAGE * 100
        }}
      />
    )
}

export const validators = {
  isNumber: validateIsNumber,
  maxValue: validateMax,
  minValue: validateMin
}
