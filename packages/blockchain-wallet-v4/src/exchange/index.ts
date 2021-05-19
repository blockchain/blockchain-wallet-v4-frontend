/* eslint-disable */
import { BigNumber } from 'bignumber.js'
import { path, prop } from 'ramda'

import { CoinType, FiatType, RatesType, WalletCurrencyType, WalletFiatType } from 'core/types'

import Currencies, { CurrenciesType } from './currencies'
import * as Currency from './currency'
import * as Pairs from './pairs'

type KeysOfUnion<T> = T extends any ? keyof T : never
export type UnitType = KeysOfUnion<CurrenciesType[keyof CurrenciesType]['units']>

const DefaultConversion = {
  value: '0',
  unit: {
    rate: '0',
    symbol: 'N/A',
    decimal_digits: 0,
    currency: 'N/A',
  },
}

const DefaultDisplay = 'N/A'

const getLang = () => {
  if (navigator.languages != undefined) return navigator.languages[0]
  return navigator.language
}

// =====================================================================
// ============================== DECIMALS =============================
// =====================================================================
const convertCoinToCoin = ({
  baseToStandard = true,
  coin,
  isFiat = false,
  value,
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
    toUnit: (baseToStandard ? config.code : config.base) as UnitType,
  }).getOrElse(DefaultConversion).value
}

const convertCoinToFiat = ({
  coin,
  value,
  currency,
  rates,
  isStandard,
}: {
  coin: CoinType
  value?: number | string
  currency: FiatType
  rates: RatesType
  isStandard?: boolean
}): string => {
  try {
    if (!value) return new BigNumber(0).toFixed(2)
    
    const { coinfig } = window.coins[coin]
    const { last } = rates[currency]
    const amt = isStandard
      ? new BigNumber(value)
      : new BigNumber(value).dividedBy(Math.pow(10, coinfig.precision))

    const fiatAmt = amt.times(last).toFixed(2)

    return fiatAmt
  } catch (e) {
    console.log(coin)
    return e
  }
}

const convertFiatToCoin = ({
  coin,
  currency,
  rates,
  value,
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
    rates,
  }).getOrElse(DefaultConversion).value
}

// 🔺Triangulate Wallet Fiat -> BTC -> To other Fiat
const convertFiatToFiat = ({
  fromCurrency,
  rates,
  toCurrency,
  value,
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
    rates,
  }).getOrElse(DefaultConversion)
  const { last } = rates[toCurrency as FiatType]
  return new BigNumber(btcAmt.value).times(last).toFixed(2)
}

// =====================================================================
// =============================== STRING ==============================
// =====================================================================
const displayCoinToCoin = ({
  coin,
  isFiat,
  value,
}: {
  coin: WalletCurrencyType
  isFiat?: boolean
  value: number | string
}): string => {
  if (isFiat) {
    return Currency.fiatToString({ value, unit: coin as FiatType })
  }

  return transformCoinToCoin({
    coin: coin as CoinType,
    value,
    fromUnit: Currencies[coin].base as UnitType,
    toUnit: coin,
  })
    .map(Currency.coinToString)
    .getOrElse(DefaultDisplay)
}

const displayCoinToFiat = ({
  coin,
  rates,
  toCurrency,
  value,
}: {
  coin: CoinType
  rates: RatesType
  toCurrency: keyof CurrenciesType
  value: number | string
}): string => {
  const { last } = rates[toCurrency as FiatType]
  const number = new BigNumber(value).times(last).toNumber()
  const options = { style: 'currency', currency: toCurrency }
  return new Intl.NumberFormat(getLang(), options).format(number)
}

const displayFiatToFiat = ({ value }: { value: number | string }) => {
  return new BigNumber(value).toFixed(2)
}

// =====================================================================
// ======================== CALCULATION (internal) =====================
// =====================================================================
const transformCoinToCoin = ({
  coin,
  fromUnit,
  toUnit,
  value,
}: {
  coin: CoinType
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  const currency = Currencies[coin]
  const sourceUnit = currency.units[fromUnit]
  const targetUnit = currency.units[toUnit]
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(Currency.toUnit(targetUnit))
}

const transformFiatToCoin = ({
  coin,
  fromCurrency,
  rates,
  toUnit,
  value,
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

const getSymbol = (currency): string => {
  const data = Currencies[currency]
  const tradeUnit = prop('trade', data)
  return path(['units', tradeUnit, 'symbol'], data) as string
}

export {
  convertCoinToCoin,
  convertCoinToFiat,
  convertFiatToCoin,
  convertFiatToFiat,
  DefaultConversion,
  displayCoinToCoin,
  displayCoinToFiat,
  displayFiatToFiat,
  getSymbol,
}
