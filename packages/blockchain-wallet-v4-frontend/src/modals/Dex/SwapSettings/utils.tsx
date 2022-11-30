import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'

import { model, selectors } from 'data'
import type { DexSwapForm } from 'data/types'

import { SLIPPAGE_PRESETS } from './constants'

const { DEFAULT_SLIPPAGE, DEX_SWAP_FORM, MAX_ALLOWED_SLIPPAGE, MIN_ALLOWED_SLIPPAGE } =
  model.components.dex

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

export type SlippageValue =
  | { isCustom: false; value: number }
  | { error?: React.ReactNode; isCustom: true; value: number }

export const useSlippageValueFromSwapForm = (): SlippageValue => {
  const dexSwapFormValues = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm
  const numericSlippageValue = dexSwapFormValues.slippage && parseFloat(dexSwapFormValues.slippage)

  // no value set in a form
  if (!numericSlippageValue || Number.isNaN(numericSlippageValue)) {
    return {
      isCustom: false,
      value: DEFAULT_SLIPPAGE
    }
  }

  // we have that value in presets
  if (SLIPPAGE_PRESETS.find((preset) => preset.value === numericSlippageValue)) {
    return {
      isCustom: false,
      value: numericSlippageValue
    }
  }

  // custom user value
  return {
    isCustom: true,
    value: numericSlippageValue
  }
}
