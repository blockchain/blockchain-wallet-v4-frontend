import AUD from './AUD'
import BCH from './BCH'
import BRL from './BRL'
import BTC from './BTC'
import CAD from './CAD'
import CHF from './CHF'
import CLP from './CLP'
import CNY from './CNY'
import DKK from './DKK'
import ETH from './ETH'
import EUR from './EUR'
import GBP from './GBP'
import HKD from './HKD'
import INR from './INR'
import ISK from './ISK'
import JPY from './JPY'
import KRW from './KRW'
import NZD from './NZD'
import PAX from './PAX'
import PLN from './PLN'
import RUB from './RUB'
import SEK from './SEK'
import SGD from './SGD'
import THB from './THB'
import TWD from './TWD'
import USD from './USD'
import XLM from './XLM'

const FiatCurrencies = {
  EUR,
  USD,
  AUD,
  BRL,
  CAD,
  CHF,
  CLP,
  CNY,
  DKK,
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
  TWD
}

const CryptoCurrencies = {
  BCH,
  BTC,
  ETH,
  PAX,
  XLM
}

const ERC20Currencies = {
  PAX
}

const Currencies = {
  ...CryptoCurrencies,
  ...FiatCurrencies
}

export type FiatCurrenciesType = typeof FiatCurrencies
export type CryptoCurrenciesType = typeof CryptoCurrencies
export type Erc20CurrenciesType = typeof ERC20Currencies
export type CurrenciesType = FiatCurrenciesType & CryptoCurrenciesType
export default Currencies
