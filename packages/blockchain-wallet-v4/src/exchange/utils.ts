import { BigNumber } from 'bignumber.js'

export const formatCoin = (value, minDigits = 0, maxDigits = 8) => {
  const bigValue = new BigNumber(value)
  const decimalPlaces = bigValue.decimalPlaces()
  if (minDigits > decimalPlaces) return bigValue.toFormat(minDigits)
  if (maxDigits < decimalPlaces) return bigValue.toFormat(maxDigits)
  return bigValue.toFormat()
}

export const getLang = (): string => {
  if (navigator.languages !== undefined) return navigator.languages[0]
  return navigator.language
}

// deprecated
export const formatFiat = (value, digits = 2) =>
  Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
