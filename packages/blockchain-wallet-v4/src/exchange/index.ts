import { BigNumber } from 'bignumber.js'
import { assocPath, path, prop } from 'ramda'

import { CoinType, RatesType, WalletFiatType } from 'core/types'

import Currencies, { CurrenciesType } from './currencies'
import * as Currency from './currency'
import * as Pairs from './pairs'

type KeysOfUnion<T> = T extends any ? keyof T : never
export type UnitType = KeysOfUnion<
  CurrenciesType[keyof CurrenciesType]['units']
>

const { BTC, DOT, ETH, XLM } = Currencies

const DefaultConversion = {
  value: '0',
  unit: {
    rate: '0',
    symbol: 'N/A',
    decimal_digits: 0,
    currency: 'N/A'
  }
}

const DefaultDisplay = 'N/A'

// =====================================================================
// ============================ CALCULATION ============================
// =====================================================================
const transformCoinToCoin = ({
  coin,
  fromUnit,
  toUnit,
  value
}: {
  coin: CoinType
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  const currency = Currencies[coin]
  const sourceUnit = currency.units[fromUnit]
  const targetUnit = currency.units[toUnit]
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(
    Currency.toUnit(targetUnit)
  )
}

const transformFiatToCoin = ({
  coin,
  fromCurrency,
  rates,
  toUnit,
  value
}: {
  coin: CoinType
  fromCurrency: keyof CurrenciesType
  rates: RatesType
  toUnit: UnitType
  value: number | string
}) => {
  const config = Currencies[coin]
  const pairs = Pairs.create(config, rates)
  const sourceCurrency = prop(fromCurrency, Currencies)
  const sourceCurrencyCode = prop('code', sourceCurrency)
  const sourceCurrencyUnit = path(['units', sourceCurrencyCode], sourceCurrency)
  const targetUnit = path(['units', toUnit], config)
  return Currency.fromUnit({ value: value, unit: sourceCurrencyUnit })
    .chain(Currency.convert(pairs, config))
    .chain(Currency.toUnit(targetUnit))
}

const transformCoinToFiat = ({
  coin,
  fromUnit,
  rates,
  toCurrency,
  value
}: {
  coin: CoinType
  fromUnit: UnitType
  rates: RatesType
  toCurrency: keyof CurrenciesType
  value: number | string
}) => {
  const config = Currencies[coin]
  const pairs = Pairs.create(config.code, rates)
  const targetCurrency = prop(toCurrency, Currencies)
  const targetCurrencyCode = prop('code', targetCurrency)
  const targetCurrencyUnit = path(['units', targetCurrencyCode], targetCurrency)
  const sourceUnit = path(['units', fromUnit], config)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convert(pairs, targetCurrency))
    .chain(Currency.toUnit(targetCurrencyUnit))
}

const transformBtcToFiat = ({
  fromUnit,
  rates,
  toCurrency,
  value
}: {
  fromUnit: UnitType
  rates: RatesType
  toCurrency: keyof CurrenciesType
  value: number | string
}) => {
  const pairs = Pairs.create(BTC.code, rates)
  const targetCurrency = prop(toCurrency, Currencies)
  const targetCurrencyCode = prop('code', targetCurrency)
  const targetCurrencyUnit = path(['units', targetCurrencyCode], targetCurrency)
  const sourceUnit = path(['units', fromUnit], BTC)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convert(pairs, targetCurrency))
    .chain(Currency.toUnit(targetCurrencyUnit))
}

const transformDotToDot = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  const sourceUnit = path(['units', fromUnit], DOT)
  const targetUnit = path(['units', toUnit], DOT)
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(
    Currency.toUnit(targetUnit)
  )
}

const transformEtherToFiat = ({
  fromUnit,
  rates,
  toCurrency,
  value
}: {
  fromUnit: UnitType
  rates: RatesType
  toCurrency: keyof CurrenciesType
  value: number | string
}) => {
  const pairs = Pairs.create(ETH.code, rates)
  const targetCurrency = prop(toCurrency, Currencies)
  const targetCurrencyCode = prop('code', targetCurrency)
  const targetCurrencyUnit = path(['units', targetCurrencyCode], targetCurrency)
  const sourceUnit = path(['units', fromUnit], ETH)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convert(pairs, targetCurrency))
    .chain(Currency.toUnit(targetCurrencyUnit))
}

const transformXlmToFiat = ({
  digits = 2,
  fromUnit,
  rates,
  toCurrency,
  value
}: {
  digits?: number
  fromUnit: UnitType
  rates: RatesType
  toCurrency: keyof CurrenciesType
  value: number | string
}) => {
  const pairs = Pairs.create(XLM.code, rates)
  const targetCurrency = prop(toCurrency, Currencies)
  const targetCurrencyCode = prop('code', targetCurrency)
  const updatedTargetCurrency = assocPath(
    ['units', targetCurrencyCode, 'decimal_digits'],
    digits,
    prop(toCurrency, Currencies)
  )
  const targetCurrencyUnit = path(
    ['units', targetCurrencyCode],
    updatedTargetCurrency
  )
  const sourceUnit = path(['units', fromUnit], XLM)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convert(pairs, updatedTargetCurrency))
    .chain(Currency.toUnit(targetCurrencyUnit))
}

// =====================================================================
// ============================== DECIMALS =============================
// =====================================================================
const convertFiatToBtc = ({
  fromCurrency,
  rates,
  toUnit,
  value
}: {
  fromCurrency: keyof CurrenciesType
  rates: RatesType
  toUnit: any
  value: number | string
}) => {
  return transformFiatToCoin({
    coin: 'BTC',
    value,
    fromCurrency,
    toUnit,
    rates
  }).getOrElse(DefaultConversion)
}

const convertBtcToFiat = ({
  fromUnit,
  rates,
  toCurrency,
  value
}: {
  fromUnit: UnitType
  rates: RatesType
  toCurrency: keyof CurrenciesType
  value: number | string
}) => {
  return transformBtcToFiat({
    value,
    fromUnit,
    toCurrency,
    rates
  }).getOrElse(DefaultConversion)
}

const convertEthToFiat = ({
  fromUnit,
  rates,
  toCurrency,
  value
}: {
  fromUnit: UnitType
  rates: RatesType
  toCurrency: keyof CurrenciesType
  value: number | string
}) => {
  return transformEtherToFiat({ value, fromUnit, toCurrency, rates }).getOrElse(
    DefaultConversion
  )
}

const convertEthToEth = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformCoinToCoin({
    coin: 'ETH',
    value,
    fromUnit,
    toUnit
  }).getOrElse(DefaultConversion)
}

const convertXlmToFiat = ({
  fromUnit,
  rates,
  toCurrency,
  value
}: {
  fromUnit: UnitType
  rates: RatesType
  toCurrency: keyof CurrenciesType
  value: number | string
}) => {
  return transformXlmToFiat({ value, fromUnit, toCurrency, rates }).getOrElse(
    DefaultConversion
  )
}

const convertXlmToXlm = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformCoinToCoin({
    coin: 'XLM',
    value,
    fromUnit,
    toUnit
  }).getOrElse(DefaultConversion)
}

// =====================================================================
// =============================== STRING ==============================
// =====================================================================
const displayCoinToCoinV2 = ({
  coin,
  fromUnit,
  toUnit,
  value
}: {
  coin: CoinType
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformCoinToCoin({
    coin,
    value,
    fromUnit,
    toUnit
  })
    .map(Currency.coinToString)
    .getOrElse(DefaultDisplay)
}

const displayDotToDot = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformDotToDot({ value, fromUnit, toUnit })
    .map(x => Currency.coinToString({ ...x, minDigits: 2 }))
    .getOrElse(DefaultDisplay)
}

const displayEthToEth = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformCoinToCoin({ coin: 'ETH', value, fromUnit, toUnit })
    .map(Currency.coinToString)
    .getOrElse(DefaultDisplay)
}

const displayPaxToPax = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformCoinToCoin({ coin: 'PAX', value, fromUnit, toUnit })
    .map(x => Currency.coinToString({ ...x, minDigits: 2, maxDigits: 2 }))
    .getOrElse(DefaultDisplay)
}
const displayCoinToFiat = ({
  fromCoin,
  fromUnit,
  rates,
  toCurrency,
  value
}: {
  fromCoin: CoinType
  fromUnit: UnitType
  rates: RatesType
  toCurrency: keyof CurrenciesType
  value: number | string
}) => {
  return transformCoinToFiat({
    coin: fromCoin,
    value,
    fromUnit,
    toCurrency,
    rates
  })
    .map(Currency.unsafe_deprecated_fiatToString)
    .getOrElse(DefaultDisplay)
}

const displayFiatToFiat = ({ value }: { value: number | string }) => {
  return new BigNumber(value).toFixed(2)
}

const getSymbol = currency => {
  const data = Currencies[currency]
  const tradeUnit = prop('trade', data)
  return path(['units', tradeUnit, 'symbol'], data)
}

const convertCoinToCoin = ({
  baseToStandard,
  coin,
  value
}: {
  baseToStandard: boolean
  coin: CoinType | 'FIAT'
  value: number | string
}) => {
  if (coin === 'FIAT') {
    return baseToStandard
      ? { value: new BigNumber(value).dividedBy(100).valueOf() }
      : { value: new BigNumber(value).multipliedBy(100).valueOf() }
  }

  const config = Currencies[coin]

  return transformCoinToCoin({
    coin,
    value,
    fromUnit: (baseToStandard ? config.base : config.code) as UnitType,
    toUnit: (baseToStandard ? config.code : config.base) as UnitType
  }).getOrElse(DefaultConversion)
}

const convertFiatToCoin = (
  coin: CoinType,
  value: number | string,
  unit: UnitType,
  currency: keyof CurrenciesType,
  rates: RatesType
) => {
  return transformFiatToCoin({
    coin,
    value,
    fromCurrency: currency,
    toUnit: unit,
    rates
  }).getOrElse(DefaultConversion).value
}

// TODO, only one coin to fiat function
const convertCoinUnitToFiat = ({
  coin,
  fromUnit,
  rates,
  toCurrency,
  value
}: {
  coin: CoinType
  fromUnit: UnitType
  rates: RatesType
  toCurrency: keyof CurrenciesType
  value: number | string
}) => {
  return transformCoinToFiat({
    coin,
    fromUnit,
    toCurrency,
    rates,
    value
  })
}

// TODO, only one coin to fiat function
const convertCoinToFiat = (
  coin: CoinType,
  value: number | string,
  fromUnit: UnitType,
  currency: keyof CurrenciesType,
  rates: RatesType
) => {
  return transformCoinToFiat({
    coin,
    value,
    fromUnit,
    toCurrency: currency,
    rates
  }).getOrElse(DefaultConversion).value
}

// 🔺Triangulate Wallet Fiat -> BTC -> To other Fiat
const convertFiatToFiat = ({
  fromCurrency,
  rates,
  toCurrency,
  value
}: {
  fromCurrency: WalletFiatType
  rates: RatesType
  toCurrency: WalletFiatType
  value: number | string
}) => {
  const btcAmt = convertFiatToBtc({ value, fromCurrency, toUnit: 'BTC', rates })
  const fiatAmt = convertBtcToFiat({
    value: btcAmt.value,
    fromUnit: 'BTC',
    toCurrency,
    rates
  })

  return fiatAmt
}

const displayCoinToCoin = (value: number | string, toUnit: CoinType) => {
  return displayCoinToCoinV2({
    coin: toUnit,
    value,
    fromUnit: Currencies[toUnit].base as UnitType,
    toUnit
  })
}

export {
  convertBtcToFiat,
  convertCoinToCoin,
  convertCoinToFiat,
  convertCoinUnitToFiat,
  convertEthToEth,
  convertEthToFiat,
  convertFiatToBtc,
  convertFiatToCoin,
  convertFiatToFiat,
  convertXlmToFiat,
  convertXlmToXlm,
  DefaultConversion,
  DefaultDisplay,
  displayCoinToCoin,
  displayCoinToFiat,
  displayDotToDot,
  displayEthToEth,
  displayFiatToFiat,
  displayPaxToPax,
  getSymbol
}
