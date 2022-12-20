import React from 'react'
import { FormattedMessage } from 'react-intl'

import { model } from 'data'

import type { ValidatorWithType } from '../types'
import { ValidatorTypeEnum } from '../types'

const { MAX_ALLOWED_SLIPPAGE, MAX_SAFE_SLIPPAGE, MIN_ALLOWED_SLIPPAGE, MIN_SAFE_SLIPPAGE } =
  model.components.dex

const validateIsNumber = (value: string) => {
  if (value.match(/^-?\d+$/) || value.match(/^\d+\.\d+$/)) {
    return
  }
  return (
    <FormattedMessage
      id='dex.settings.slippageIsNotANumber'
      defaultMessage='Value must be a number'
    />
  )
}

const validateMin = (value: number) => {
  if (value < MIN_ALLOWED_SLIPPAGE)
    return (
      <FormattedMessage
        id='dex.settings.invalidMinSlippage'
        defaultMessage='Value must be greater than {limit}%'
        values={{
          limit: MIN_ALLOWED_SLIPPAGE * 100
        }}
      />
    )
}

const validateMax = (value: number) => {
  if (value > MAX_ALLOWED_SLIPPAGE)
    return (
      <FormattedMessage
        id='dex.settings.invalidMaxSlippage'
        defaultMessage='Value must be less than {limit}%'
        values={{
          limit: MAX_ALLOWED_SLIPPAGE * 100
        }}
      />
    )
}

const validateSafeMin = (value: number) => {
  if (value < MIN_SAFE_SLIPPAGE)
    return (
      <FormattedMessage
        id='dex.settings.notSafeMinSlippage'
        defaultMessage='Transaction will likely fail due to low slippage.'
      />
    )
}

const validateSafeMax = (value: number) => {
  if (value > MAX_SAFE_SLIPPAGE)
    return (
      <FormattedMessage
        id='dex.settings.notSafeMaxSlippage'
        defaultMessage='Your transaction may be frontrun.'
      />
    )
}

const chainValidators = (
  value: number,
  validators: ValidatorWithType[]
): { message?: JSX.Element; type?: ValidatorTypeEnum; value: number } => {
  for (let index = 0; index < validators.length; index += 1) {
    const error = validators[index].validate(value)
    if (error) return { message: error, type: validators[index].type, value }
  }

  return { value }
}

export const validateSlippage = (value: string) => {
  // clean errors and warnings for an empty value
  if (value == null || value === '') {
    return {
      isCustom: true,
      value: 0
    }
  }

  // TODO: Remove when constellation input with type number actually accepts only numbers
  const notNumber = validateIsNumber(value)
  if (notNumber) {
    return {
      isCustom: true,
      message: notNumber,
      messageType: ValidatorTypeEnum.ERROR,
      value: 0
    }
  }

  const validatorsOrder = [
    { type: ValidatorTypeEnum.ERROR, validate: validateMin },
    { type: ValidatorTypeEnum.ERROR, validate: validateMax },
    { type: ValidatorTypeEnum.WARNING, validate: validateSafeMin },
    { type: ValidatorTypeEnum.WARNING, validate: validateSafeMax }
  ]

  const validationResult = chainValidators(parseFloat(value) / 100, validatorsOrder)

  return {
    isCustom: true,
    message: validationResult.message,
    messageType: validationResult.type,
    value: validationResult.value
  }
}
