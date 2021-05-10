import { BigNumber } from 'bignumber.js'
import { path, prop } from 'ramda'

import {
  CoinType,
  FiatType,
  RatesType,
  WalletCurrencyType,
  WalletFiatType
} from 'core/types'

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
// Still used for gwei => eth conversion
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
const displayCoinToCoin = (
  value: number | string,
  toUnit: WalletCurrencyType,
  isFiat?: boolean
) => {
  if (isFiat) {
    return Currency.fiatToString({ value, unit: toUnit as FiatType })
  }

  return transformCoinToCoin({
    coin: toUnit as CoinType,
    value,
    fromUnit: Currencies[toUnit].base as UnitType,
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
  isFiat = false,
  value
}: {
  baseToStandard?: boolean
  coin: WalletCurrencyType | 'FIAT'
  isFiat?: boolean
  value: number | string
}): string => {
  if (isFiat || coin === 'FIAT') {
    return baseToStandard
      ? new BigNumber(value).dividedBy(100).valueOf()
      : new BigNumber(value).multipliedBy(100).valueOf()
  }

  const config = Currencies[coin]

  return transformCoinToCoin({
    coin: coin as CoinType,
    value,
    fromUnit: (baseToStandard ? config.base : config.code) as UnitType,
    toUnit: (baseToStandard ? config.code : config.base) as UnitType
  }).getOrElse(DefaultConversion).value
}

const convertFiatToCoin = ({
  coin,
  currency,
  rates,
  value
}: {
  coin: CoinType
  currency: keyof CurrenciesType
  rates: RatesType
  value: number | string
}): string => {
  const config = Currencies[coin]
  return transformFiatToCoin({
    coin,
    value,
    fromCurrency: currency,
    toUnit: config.code as UnitType,
    rates
  }).getOrElse(DefaultConversion).value
}

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
  const btcAmt = transformFiatToCoin({
    coin: 'BTC',
    value,
    fromCurrency,
    toUnit: 'BTC',
    rates
  }).getOrElse(DefaultConversion)
  const fiatAmt = transformCoinToFiat({
    coin: 'BTC',
    value: btcAmt.value,
    fromUnit: 'BTC',
    toCurrency,
    rates
  }).getOrElse(DefaultConversion)

  return fiatAmt
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
