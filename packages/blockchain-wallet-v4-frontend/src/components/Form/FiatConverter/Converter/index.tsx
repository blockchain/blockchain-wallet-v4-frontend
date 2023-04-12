import React, { useEffect, useState } from 'react'
import { equals } from 'ramda'

import { useDebounce } from 'hooks'

import Converter from './Converter.template'
import { ConverterContainerPropsType, ConverterValueType } from './Converter.types'
import { convertCoinToFiat, convertFiatToCoin } from './Converter.utils'

const ConverterContainer: React.FC<ConverterContainerPropsType> = ({
  coinTicker,
  currency,
  'data-e2e': dataE2E,
  disabled,
  errorBottom,
  marginTop,
  meta,
  onBlur,
  onChange,
  onFocus,
  rates,
  unit,
  value
}: ConverterContainerPropsType) => {
  const [state, setState] = useState<ConverterValueType>(value)
  const debouncedVal = useDebounce(state, 400)
  useEffect(() => {
    if (!equals(value, state)) {
      onChange(debouncedVal)
    }
  }, [debouncedVal, onChange])

  useEffect(() => {
    setState(value)
  }, [value])

  const handleCoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextProps = convertCoinToFiat({ currency, rates, unit, value: e.target.value })

    setState(nextProps)
  }

  const handleFiatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const decimals = e.target.value.split('.')[1]
    const needsFormatting = decimals && decimals.length > 2
    const val = needsFormatting ? Number(e.target.value).toFixed(2) : e.target.value

    const nextProps = convertFiatToCoin({ currency, rates, unit, value: val })
    setState(nextProps)
  }

  const handleBlur = () => {
    onBlur(state)
  }
  const handleFocus = () => {
    onFocus(state)
  }

  const { coin, fiat } = state

  return (
    <Converter
      coin={coin}
      coinTicker={coinTicker}
      currency={currency}
      data-e2e={dataE2E}
      disabled={disabled}
      errorBottom={errorBottom}
      fiat={fiat}
      handleBlur={handleBlur}
      handleFocus={handleFocus}
      handleCoinChange={handleCoinChange}
      handleFiatChange={handleFiatChange}
      marginTop={marginTop}
      meta={meta}
    />
  )
}

export default ConverterContainer
