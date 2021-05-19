import ALGO from './ALGO'
import AUD from './AUD'
import BCH from './BCH'
import BRL from './BRL'
import BTC from './BTC'
import CAD from './CAD'
import CHF from './CHF'
import CLP from './CLP'
import CNY from './CNY'
import DKK from './DKK'
import DOT from './DOT'
import ETH from './ETH'
import EUR from './EUR'
import GBP from './GBP'
import HKD from './HKD'
import INR from './INR'
import ISK from './ISK'
import JPY from './JPY'
import KRW from './KRW'
import NZD from './NZD'
import PLN from './PLN'
import RUB from './RUB'
import SEK from './SEK'
import SGD from './SGD'
import THB from './THB'
import TRY from './TRY'
import TWD from './TWD'
import USD from './USD'
import XLM from './XLM'

export const FiatCurrencies = {
  AUD,
  BRL,
  CAD,
  CHF,
  CLP,
  CNY,
  DKK,
  EUR,
  GBP,
  HKD,
  INR,
  ISK,
  JPY,
  KRW,
  NZD,
  PLN,
  RUB,
  SEK,
  SGD,
  THB,
  TRY,
  TWD,
  USD,
}

const CryptoCurrencies = {
  ALGO,
  BCH,
  BTC,
  DOT,
  ETH,
  XLM,
}

const Currencies = {
  ...CryptoCurrencies,
  ...FiatCurrencies,
}

export type FiatCurrenciesType = typeof FiatCurrencies
export type CryptoCurrenciesType = typeof CryptoCurrencies
export type CurrenciesType = FiatCurrenciesType & CryptoCurrenciesType
export type CurrencyType = {
  base: string
  code: string
  displayName: string
  trade: string
  units: {
    [key in string]: {
      currency: string
      decimal_digits: number
      rate: string
      symbol: string
    }
  }
}

export default Currencies
