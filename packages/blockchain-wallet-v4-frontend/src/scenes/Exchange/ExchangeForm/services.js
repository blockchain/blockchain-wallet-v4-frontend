import {
  coinToString,
  unsafe_deprecated_fiatToString
} from 'blockchain-wallet-v4/src/exchange/currency'

export const formatAmount = (isFiat, symbol, value = 0) =>
  isFiat
    ? unsafe_deprecated_fiatToString({ value, unit: { symbol } })
    : coinToString({ value, unit: { symbol }, minDigits: 2 })
