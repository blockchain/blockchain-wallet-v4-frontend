import {
  coinToString,
  unsafe_deprecated_fiatToString
} from 'blockchain-wallet-v4/src/exchange/currency'
import { CoinType } from 'core/types'

export const formatAmount = (isFiat: boolean, symbol: CoinType, value = 0) =>
  isFiat
    ? unsafe_deprecated_fiatToString({ value, unit: { symbol } })
    : coinToString({ value, unit: { symbol }, minDigits: 2 })
