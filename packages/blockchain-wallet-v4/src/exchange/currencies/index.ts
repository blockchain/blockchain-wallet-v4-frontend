import AAVE from './AAVE'
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
import PAX from './PAX'
import PLN from './PLN'
import RUB from './RUB'
import SEK from './SEK'
import SGD from './SGD'
import THB from './THB'
import TRY from './TRY'
import TWD from './TWD'
import USD from './USD'
import USDT from './USDT'
import WDGLD from './WDGLD'
import XLM from './XLM'
import YFI from './YFI'

export const FiatCurrencies = {
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
  TRY,
  TWD
}

const CryptoCurrencies = {
  AAVE,
  ALGO,
  BCH,
  BTC,
  DOT,
  ETH,
  PAX,
  USDT,
  WDGLD,
  XLM,
  YFI
}

const ERC20Currencies = {
  AAVE,
  PAX,
  USDT,
  WDGLD,
  YFI
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
