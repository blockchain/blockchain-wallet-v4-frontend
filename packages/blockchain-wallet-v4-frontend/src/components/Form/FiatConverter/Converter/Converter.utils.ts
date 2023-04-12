import { Exchange } from '@core'

import { ConverterValueType, ConvertHelperPropsType } from './Converter.types'

export const convertFiatToCoin = ({
  currency,
  rates,
  unit,
  value
}: ConvertHelperPropsType): ConverterValueType => ({
  coin: Exchange.convertFiatToCoin({ coin: unit, currency, maxPrecision: 8, rates, value }),
  fiat: value
})

export const convertCoinToFiat = ({
  currency,
  rates,
  unit,
  value
}: ConvertHelperPropsType): ConverterValueType => ({
  coin: value,
  fiat: Exchange.convertCoinToFiat({ coin: unit, currency, isStandard: true, rates, value })
})

export const getErrorState = (meta) => {
  return meta.touched && meta.invalid ? 'invalid' : 'initial'
}
