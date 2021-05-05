import { BigNumber } from 'bignumber.js'
import { path, prop } from 'ramda'

import { CoinType, RatesType, WalletFiatType } from 'core/types'

import Currencies, { CurrenciesType } from './currencies'
import * as Currency from './currency'
import * as Pairs from './pairs'

type KeysOfUnion<T> = T extends any ? keyof T : never
export type UnitType = KeysOfUnion<
  CurrenciesType[keyof CurrenciesType]['units']
>

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
  return transformCoinToFiat({
    coin: 'BTC',
    value,
    fromUnit,
    toCurrency,
    rates
  }).getOrElse(DefaultConversion)
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

const convertCoinToCoin = ({
  baseToStandard = true,
  coin,
  value
}: {
  baseToStandard?: boolean
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

const getSymbol = currency => {
  const data = Currencies[currency]
  const tradeUnit = prop('trade', data)
  return path(['units', tradeUnit, 'symbol'], data)
}

export {
  convertCoinToCoin,
  convertCoinToFiat,
  convertEthToEth,
  convertFiatToCoin,
  convertFiatToFiat,
  DefaultConversion,
  displayCoinToCoin,
  displayCoinToFiat,
  displayFiatToFiat,
  getSymbol
}
