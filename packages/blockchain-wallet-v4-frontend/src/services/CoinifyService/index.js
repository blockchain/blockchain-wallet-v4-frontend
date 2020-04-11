import { mapObjIndexed } from 'ramda'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'

export const currencySymbolMap = mapObjIndexed(
  (value, code) => value.units[code].symbol,
  Currencies
)
