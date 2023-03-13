import React from 'react'
import { WrappedFieldMetaProps } from 'redux-form'

import { CoinType, FiatType, RatesType } from '@core/types'

export type ConverterValueType = {
  coin: string
  fiat: string
}

export type ConverterContainerPropsType = {
  coinTicker?: CoinType
  currency: FiatType
  'data-e2e'?: string
  disabled?: boolean
  errorBottom?: boolean
  marginTop?: string
  meta: WrappedFieldMetaProps
  onBlur: (val: ConverterValueType) => void
  onChange: (val: ConverterValueType) => void
  onFocus: (val: ConverterValueType) => void
  rates: RatesType
  unit: CoinType
  value: ConverterValueType
}

export type ConverterPropsType = {
  coin: string
  coinTicker?: CoinType
  currency: FiatType
  disabled?: boolean
  errorBottom?: boolean
  fiat: string
  handleBlur: () => void
  handleCoinChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleFiatChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleFocus: () => void
  marginTop?: string
  meta: WrappedFieldMetaProps
}

export type ConvertFiatToCoinPropsType = {
  currency: FiatType
}

export type ConvertHelperPropsType = {
  currency: FiatType
  rates: RatesType
  unit: CoinType
  value: string
}
