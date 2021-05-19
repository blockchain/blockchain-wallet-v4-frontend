import { BigNumber } from 'bignumber.js'

import { FiatType } from 'blockchain-wallet-v4/src/types'

import Currencies from './currencies'

export const getLang = (): string => {
  if (navigator.languages !== undefined) return navigator.languages[0]
  return navigator.language
}

export const formatCoin = (value, minDigits = 0, maxDigits = 8) => {
  const bigValue = new BigNumber(value)
  const decimalPlaces = bigValue.decimalPlaces()
  if (minDigits > decimalPlaces) return bigValue.toFormat(minDigits)
  if (maxDigits < decimalPlaces) return bigValue.toFormat(maxDigits)
  return bigValue.toFormat()
}

// deprecated
export const formatFiat = (value, digits = 2) =>
  Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })

export const coinToString = ({
  maxDigits = 8,
  minDigits = 0,
  unit,
  value,
}: {
  maxDigits?: number
  minDigits?: number
  unit: { symbol: string }
  value: any
}): string => `${formatCoin(value, minDigits, maxDigits)} ${unit.symbol}`

export const fiatToString = ({
  digits = 2,
  unit,
  value,
}: {
  digits?: number
  unit: FiatType
  value: string | number
}): string => {
  return `${Currencies[unit].units[unit].symbol}${formatFiat(value, digits)}`
}
