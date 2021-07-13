import { BigNumber } from 'bignumber.js'
import { assoc, assocPath, path, prop } from 'ramda'

import {
  CoinType,
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

const {
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
} = Currencies

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
const transformFiatToBtc = ({
  fromCurrency,
  rates,
  toUnit,
  value
}: {
  fromCurrency: keyof CurrenciesType
  rates: RatesType
  toUnit: UnitType
  value: number | string
}) => {
  const pairs = Pairs.create(BTC.code, rates)
  const sourceCurrency = prop(fromCurrency, Currencies)
  const sourceCurrencyCode = prop('code', sourceCurrency)
  const sourceCurrencyUnit = path(['units', sourceCurrencyCode], sourceCurrency)
  const targetUnit = path(['units', toUnit], BTC)
  return Currency.fromUnit({ value: value, unit: sourceCurrencyUnit })
    .chain(Currency.convert(pairs, BTC))
    .chain(Currency.toUnit(targetUnit))
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

const transformBtcToBtc = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  const sourceUnit = path(['units', fromUnit], BTC)
  const targetUnit = path(['units', toUnit], BTC)
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(
    Currency.toUnit(targetUnit)
  )
}

const transformDotToFiat = ({
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
  const pairs = Pairs.create(DOT.code, rates)
  const targetCurrency = prop(toCurrency, Currencies)
  const targetCurrencyCode = prop('code', targetCurrency)
  const targetCurrencyUnit = path(['units', targetCurrencyCode], targetCurrency)
  const sourceUnit = path(['units', fromUnit], DOT)
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

const transformFiatToDot = ({
  fromCurrency,
  rates,
  toUnit,
  value
}: {
  fromCurrency: keyof CurrenciesType
  rates: RatesType
  toUnit: UnitType
  value: number | string
}) => {
  const pairs = Pairs.create(DOT.code, rates)
  const sourceCurrency = prop(fromCurrency, Currencies)
  const sourceCurrencyCode = prop('code', sourceCurrency)
  const sourceCurrencyUnit = path(['units', sourceCurrencyCode], sourceCurrency)
  const targetUnit = path(['units', toUnit], DOT)
  return Currency.fromUnit({ value: value, unit: sourceCurrencyUnit })
    .chain(Currency.convert(pairs, DOT))
    .chain(Currency.toUnit(targetUnit))
}

const transformFiatToEther = ({
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
  const pairs = Pairs.create(ETH.code, rates)
  const sourceCurrency = prop(fromCurrency, Currencies)
  const sourceCurrencyCode = prop('code', sourceCurrency)
  const sourceCurrencyUnit = path(['units', sourceCurrencyCode], sourceCurrency)
  const targetUnit = path(['units', toUnit], ETH)
  return Currency.fromUnit({ value: value, unit: sourceCurrencyUnit })
    .chain(Currency.convert(pairs, ETH))
    .chain(Currency.toUnit(targetUnit))
}

const transformFiatToPax = ({
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
  const pairs = Pairs.create(PAX.code, rates)
  const sourceCurrency = prop(fromCurrency, Currencies)
  const sourceCurrencyCode = prop('code', sourceCurrency)
  const sourceCurrencyUnit = path(['units', sourceCurrencyCode], sourceCurrency)
  const targetUnit = path(['units', toUnit], PAX)
  return Currency.fromUnit({ value: value, unit: sourceCurrencyUnit })
    .chain(Currency.convert(pairs, PAX))
    .chain(Currency.toUnit(targetUnit))
}

const transformFiatToAave = ({
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
  const pairs = Pairs.create(AAVE.code, rates)
  const sourceCurrency = prop(fromCurrency, Currencies)
  const sourceCurrencyCode = prop('code', sourceCurrency)
  const sourceCurrencyUnit = path(['units', sourceCurrencyCode], sourceCurrency)
  const targetUnit = path(['units', toUnit], AAVE)
  return Currency.fromUnit({ value: value, unit: sourceCurrencyUnit })
    .chain(Currency.convert(pairs, AAVE))
    .chain(Currency.toUnit(targetUnit))
}

const transformFiatToYfi = ({
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
  const pairs = Pairs.create(YFI.code, rates)
  const sourceCurrency = prop(fromCurrency, Currencies)
  const sourceCurrencyCode = prop('code', sourceCurrency)
  const sourceCurrencyUnit = path(['units', sourceCurrencyCode], sourceCurrency)
  const targetUnit = path(['units', toUnit], YFI)
  return Currency.fromUnit({ value: value, unit: sourceCurrencyUnit })
    .chain(Currency.convert(pairs, YFI))
    .chain(Currency.toUnit(targetUnit))
}

const transformFiatToUsdt = ({
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
  const pairs = Pairs.create(USDT.code, rates)
  const sourceCurrency = prop(fromCurrency, Currencies)
  const sourceCurrencyCode = prop('code', sourceCurrency)
  const sourceCurrencyUnit = path(['units', sourceCurrencyCode], sourceCurrency)
  const targetUnit = path(['units', toUnit], USDT)
  return Currency.fromUnit({ value: value, unit: sourceCurrencyUnit })
    .chain(Currency.convert(pairs, USDT))
    .chain(Currency.toUnit(targetUnit))
}
const transformFiatToWdgld = ({
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
  const pairs = Pairs.create(WDGLD.code, rates)
  const sourceCurrency = prop(fromCurrency, Currencies)
  const sourceCurrencyCode = prop('code', sourceCurrency)
  const sourceCurrencyUnit = path(['units', sourceCurrencyCode], sourceCurrency)
  const targetUnit = path(['units', toUnit], WDGLD)
  return Currency.fromUnit({ value: value, unit: sourceCurrencyUnit })
    .chain(Currency.convert(pairs, WDGLD))
    .chain(Currency.toUnit(targetUnit))
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

const transformPaxToFiat = ({
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
  const pairs = Pairs.create(PAX.code, rates)
  const targetCurrency = prop(toCurrency, Currencies)
  const targetCurrencyCode = prop('code', targetCurrency)
  const targetCurrencyUnit = path(['units', targetCurrencyCode], targetCurrency)
  const sourceUnit = path(['units', fromUnit], PAX)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convert(pairs, targetCurrency))
    .chain(Currency.toUnit(targetCurrencyUnit))
}

const transformYfiToFiat = ({
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
  const pairs = Pairs.create(YFI.code, rates)
  const targetCurrency = prop(toCurrency, Currencies)
  const targetCurrencyCode = prop('code', targetCurrency)
  const targetCurrencyUnit = path(['units', targetCurrencyCode], targetCurrency)
  const sourceUnit = path(['units', fromUnit], YFI)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convert(pairs, targetCurrency))
    .chain(Currency.toUnit(targetCurrencyUnit))
}

const transformAaveToFiat = ({
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
  const pairs = Pairs.create(AAVE.code, rates)
  const targetCurrency = prop(toCurrency, Currencies)
  const targetCurrencyCode = prop('code', targetCurrency)
  const targetCurrencyUnit = path(['units', targetCurrencyCode], targetCurrency)
  const sourceUnit = path(['units', fromUnit], AAVE)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convert(pairs, targetCurrency))
    .chain(Currency.toUnit(targetCurrencyUnit))
}

const transformUsdtToFiat = ({
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
  const pairs = Pairs.create(USDT.code, rates)
  const targetCurrency = prop(toCurrency, Currencies)
  const targetCurrencyCode = prop('code', targetCurrency)
  const targetCurrencyUnit = path(['units', targetCurrencyCode], targetCurrency)
  const sourceUnit = path(['units', fromUnit], USDT)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convert(pairs, targetCurrency))
    .chain(Currency.toUnit(targetCurrencyUnit))
}

const transformWdgldToFiat = ({
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
  const pairs = Pairs.create(WDGLD.code, rates)
  const targetCurrency = prop(toCurrency, Currencies)
  const targetCurrencyCode = prop('code', targetCurrency)
  const targetCurrencyUnit = path(['units', targetCurrencyCode], targetCurrency)
  const sourceUnit = path(['units', fromUnit], WDGLD)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convert(pairs, targetCurrency))
    .chain(Currency.toUnit(targetCurrencyUnit))
}

const transformEtherToEther = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  const sourceUnit = path(['units', fromUnit], ETH)
  const targetUnit = path(['units', toUnit], ETH)
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(
    Currency.toUnit(targetUnit)
  )
}

const transformPaxToPax = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  const sourceUnit = path(['units', fromUnit], PAX)
  const targetUnit = path(['units', toUnit], PAX)
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(
    Currency.toUnit(targetUnit)
  )
}

const transformYfiToYfi = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  const sourceUnit = path(['units', fromUnit], YFI)
  const targetUnit = path(['units', toUnit], YFI)
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(
    Currency.toUnit(targetUnit)
  )
}

const transformAaveToAave = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  const sourceUnit = path(['units', fromUnit], AAVE)
  const targetUnit = path(['units', toUnit], AAVE)
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(
    Currency.toUnit(targetUnit)
  )
}

const transformUsdtToUsdt = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  const sourceUnit = path(['units', fromUnit], USDT)
  const targetUnit = path(['units', toUnit], USDT)
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(
    Currency.toUnit(targetUnit)
  )
}

const transformWdgldToWdgld = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  const sourceUnit = path(['units', fromUnit], WDGLD)
  const targetUnit = path(['units', toUnit], WDGLD)
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(
    Currency.toUnit(targetUnit)
  )
}

const transformFiatToBch = ({
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
  const pairs = Pairs.create(BCH.code, rates)
  const sourceCurrency = prop(fromCurrency, Currencies)
  const sourceCurrencyCode = prop('code', sourceCurrency)
  const sourceCurrencyUnit = path(['units', sourceCurrencyCode], sourceCurrency)
  const targetUnit = path(['units', toUnit], BCH)
  return Currency.fromUnit({ value: value, unit: sourceCurrencyUnit })
    .chain(Currency.convert(pairs, BCH))
    .chain(Currency.toUnit(targetUnit))
}

const transformBchToFiat = ({
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
  const pairs = Pairs.create(BCH.code, rates)
  const targetCurrency = prop(toCurrency, Currencies)
  const targetCurrencyCode = prop('code', targetCurrency)
  const targetCurrencyUnit = path(['units', targetCurrencyCode], targetCurrency)
  const sourceUnit = path(['units', fromUnit], BCH)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convert(pairs, targetCurrency))
    .chain(Currency.toUnit(targetCurrencyUnit))
}

const transformBchToBch = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  const sourceUnit = path(['units', fromUnit], BCH)
  const targetUnit = path(['units', toUnit], BCH)
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(
    Currency.toUnit(targetUnit)
  )
}

const transformFiatToXlm = ({
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
  const pairs = Pairs.create(XLM.code, rates)
  const sourceCurrency = prop(fromCurrency, Currencies)
  const sourceCurrencyCode = prop('code', sourceCurrency)
  const sourceCurrencyUnit = path(['units', sourceCurrencyCode], sourceCurrency)
  const targetUnit = path(['units', toUnit], XLM)
  return Currency.fromUnit({ value: value, unit: sourceCurrencyUnit })
    .chain(Currency.convert(pairs, XLM))
    .chain(Currency.toUnit(targetUnit))
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

const transformXlmToXlm = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  const sourceUnit = path(['units', fromUnit], XLM)
  const targetUnit = path(['units', toUnit], XLM)
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(
    Currency.toUnit(targetUnit)
  )
}

const transformFiatToAlgo = ({
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
  const pairs = Pairs.create(ALGO.code, rates)
  const sourceCurrency = prop(fromCurrency, Currencies)
  const sourceCurrencyCode = prop('code', sourceCurrency)
  const sourceCurrencyUnit = path(['units', sourceCurrencyCode], sourceCurrency)
  const targetUnit = path(['units', toUnit], ALGO)
  return Currency.fromUnit({ value: value, unit: sourceCurrencyUnit })
    .chain(Currency.convert(pairs, ALGO))
    .chain(Currency.toUnit(targetUnit))
}

const transformAlgoToFiat = ({
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
  const pairs = Pairs.create(ALGO.code, rates)
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
  const sourceUnit = path(['units', fromUnit], ALGO)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convert(pairs, updatedTargetCurrency))
    .chain(Currency.toUnit(targetCurrencyUnit))
}

const transformAlgoToAlgo = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  const sourceUnit = path(['units', fromUnit], ALGO)
  const targetUnit = path(['units', toUnit], ALGO)
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(
    Currency.toUnit(targetUnit)
  )
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
  return transformFiatToBtc({
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

const convertBtcToBtc = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformBtcToBtc({ value, fromUnit, toUnit }).getOrElse(
    DefaultConversion
  )
}

const convertDotToFiat = ({
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
  return transformDotToFiat({
    value,
    fromUnit,
    toCurrency,
    rates
  }).getOrElse(DefaultConversion)
}

const convertFiatToDot = ({
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
  return transformFiatToDot({
    value,
    fromCurrency,
    toUnit,
    rates
  }).getOrElse(DefaultConversion)
}

const convertDotToDot = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformDotToDot({ value, fromUnit, toUnit }).getOrElse(
    DefaultConversion
  )
}

const convertFiatToEther = ({
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
  return transformFiatToEther({ value, fromCurrency, toUnit, rates }).getOrElse(
    DefaultConversion
  )
}

const convertFiatToPax = ({
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
  return transformFiatToPax({ value, fromCurrency, toUnit, rates }).getOrElse(
    DefaultConversion
  )
}

const convertFiatToAave = ({
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
  return transformFiatToAave({ value, fromCurrency, toUnit, rates }).getOrElse(
    DefaultConversion
  )
}

const convertFiatToYfi = ({
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
  return transformFiatToYfi({ value, fromCurrency, toUnit, rates }).getOrElse(
    DefaultConversion
  )
}

const convertFiatToUsdt = ({
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
  return transformFiatToUsdt({ value, fromCurrency, toUnit, rates }).getOrElse(
    DefaultConversion
  )
}
const convertFiatToWdgld = ({
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
  return transformFiatToWdgld({ value, fromCurrency, toUnit, rates }).getOrElse(
    DefaultConversion
  )
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

const convertPaxToFiat = ({
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
  return transformPaxToFiat({ value, fromUnit, toCurrency, rates }).getOrElse(
    DefaultConversion
  )
}

const convertAaveToFiat = ({
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
  return transformAaveToFiat({ value, fromUnit, toCurrency, rates }).getOrElse(
    DefaultConversion
  )
}

const convertYfiToFiat = ({
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
  return transformYfiToFiat({ value, fromUnit, toCurrency, rates }).getOrElse(
    DefaultConversion
  )
}

const convertUsdtToFiat = ({
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
  return transformUsdtToFiat({ value, fromUnit, toCurrency, rates }).getOrElse(
    DefaultConversion
  )
}

const convertWdgldToFiat = ({
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
  return transformWdgldToFiat({ value, fromUnit, toCurrency, rates }).getOrElse(
    DefaultConversion
  )
}

const convertEtherToEther = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformEtherToEther({ value, fromUnit, toUnit }).getOrElse(
    DefaultConversion
  )
}

const convertPaxToPax = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformPaxToPax({ value, fromUnit, toUnit }).getOrElse(
    DefaultConversion
  )
}

const convertAaveToAave = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformAaveToAave({ value, fromUnit, toUnit }).getOrElse(
    DefaultConversion
  )
}

const convertYfiToYfi = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformYfiToYfi({ value, fromUnit, toUnit }).getOrElse(
    DefaultConversion
  )
}

const convertUsdtToUsdt = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformUsdtToUsdt({ value, fromUnit, toUnit }).getOrElse(
    DefaultConversion
  )
}

const convertWdgldToWdgld = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformWdgldToWdgld({ value, fromUnit, toUnit }).getOrElse(
    DefaultConversion
  )
}

const convertFiatToBch = ({
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
  return transformFiatToBch({ value, fromCurrency, toUnit, rates }).getOrElse(
    DefaultConversion
  )
}

const convertBchToFiat = ({
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
  return transformBchToFiat({ value, fromUnit, toCurrency, rates }).getOrElse(
    DefaultConversion
  )
}

const convertBchToBch = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformBchToBch({ value, fromUnit, toUnit }).getOrElse(
    DefaultConversion
  )
}

const convertFiatToXlm = ({
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
  return transformFiatToXlm({ value, fromCurrency, toUnit, rates }).getOrElse(
    DefaultConversion
  )
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
  return transformXlmToXlm({ value, fromUnit, toUnit }).getOrElse(
    DefaultConversion
  )
}

const convertFiatToAlgo = ({
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
  return transformFiatToAlgo({ value, fromCurrency, toUnit, rates }).getOrElse(
    DefaultConversion
  )
}

const convertAlgoToFiat = ({
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
  return transformAlgoToFiat({ value, fromUnit, toCurrency, rates }).getOrElse(
    DefaultConversion
  )
}

const convertAlgoToAlgo = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformAlgoToAlgo({ value, fromUnit, toUnit }).getOrElse(
    DefaultConversion
  )
}

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
  switch (coin) {
    case 'AAVE':
      return transformAaveToFiat({
        value,
        fromUnit,
        toCurrency,
        rates
      }).getOrElse(DefaultConversion)
    case 'BCH':
      return transformBchToFiat({
        value,
        fromUnit,
        toCurrency,
        rates
      }).getOrElse(DefaultConversion)
    case 'BTC':
      return transformBtcToFiat({
        value,
        fromUnit,
        toCurrency,
        rates
      }).getOrElse(DefaultConversion)
    case 'DOT':
      return transformDotToFiat({
        value,
        fromUnit,
        toCurrency,
        rates
      }).getOrElse(DefaultConversion)
    case 'ETH':
      return transformEtherToFiat({
        value,
        fromUnit,
        toCurrency,
        rates
      }).getOrElse(DefaultConversion)
    case 'PAX':
      return transformPaxToFiat({
        value,
        fromUnit,
        toCurrency,
        rates
      }).getOrElse(DefaultConversion)
    case 'USDT':
      return transformUsdtToFiat({
        value,
        fromUnit,
        toCurrency,
        rates
      }).getOrElse(DefaultConversion)
    case 'WDGLD':
      return transformWdgldToFiat({
        value,
        fromUnit,
        toCurrency,
        rates
      }).getOrElse(DefaultConversion)
    case 'XLM':
      return transformXlmToFiat({
        value,
        fromUnit,
        toCurrency,
        rates
      }).getOrElse(DefaultConversion)
    case 'YFI':
      return transformYfiToFiat({
        value,
        fromUnit,
        toCurrency,
        rates
      }).getOrElse(DefaultConversion)
    default:
      return 'Unsupported Coin Code'
  }
}

const convertCoinToCoin = ({
  baseToStandard,
  coin,
  value
}: {
  baseToStandard: boolean
  coin: WalletCurrencyType | 'FIAT' | 'USD-D'
  value: number | string
}) => {
  switch (coin) {
    case 'AAVE':
      return baseToStandard
        ? convertAaveToAave({ value, fromUnit: 'WEI', toUnit: 'AAVE' })
        : convertAaveToAave({ value, fromUnit: 'AAVE', toUnit: 'WEI' })
    case 'ALGO':
      return baseToStandard
        ? convertAlgoToAlgo({ value, fromUnit: 'mALGO', toUnit: 'ALGO' })
        : convertAlgoToAlgo({ value, fromUnit: 'ALGO', toUnit: 'mALGO' })
    case 'BCH':
      return baseToStandard
        ? convertBchToBch({ value, fromUnit: 'SAT', toUnit: 'BCH' })
        : convertBchToBch({ value, fromUnit: 'BCH', toUnit: 'SAT' })
    case 'BTC':
      return baseToStandard
        ? convertBtcToBtc({ value, fromUnit: 'SAT', toUnit: 'BTC' })
        : convertBtcToBtc({ value, fromUnit: 'BTC', toUnit: 'SAT' })
    case 'DOT':
      return baseToStandard
        ? convertDotToDot({ value, fromUnit: 'PLANCK', toUnit: 'DOT' })
        : convertDotToDot({ value, fromUnit: 'DOT', toUnit: 'PLANCK' })
    case 'ETH':
      return baseToStandard
        ? convertEtherToEther({ value, fromUnit: 'WEI', toUnit: 'ETH' })
        : convertEtherToEther({ value, fromUnit: 'ETH', toUnit: 'WEI' })
    case 'USD-D':
    case 'PAX':
      return baseToStandard
        ? convertPaxToPax({ value, fromUnit: 'WEI', toUnit: 'PAX' })
        : convertPaxToPax({ value, fromUnit: 'PAX', toUnit: 'WEI' })
    case 'USDT':
      return baseToStandard
        ? convertUsdtToUsdt({ value, fromUnit: 'WEI', toUnit: 'USDT' })
        : convertUsdtToUsdt({ value, fromUnit: 'USDT', toUnit: 'WEI' })
    case 'WDGLD':
      return baseToStandard
        ? convertWdgldToWdgld({ value, fromUnit: 'WEI', toUnit: 'WDGLD' })
        : convertWdgldToWdgld({ value, fromUnit: 'WDGLD', toUnit: 'WEI' })
    case 'XLM':
      return baseToStandard
        ? convertXlmToXlm({ value, fromUnit: 'STROOP', toUnit: 'XLM' })
        : convertXlmToXlm({ value, fromUnit: 'XLM', toUnit: 'STROOP' })
    case 'YFI':
      return baseToStandard
        ? convertYfiToYfi({ value, fromUnit: 'WEI', toUnit: 'YFI' })
        : convertYfiToYfi({ value, fromUnit: 'YFI', toUnit: 'WEI' })
    case 'EUR':
    case 'GBP':
    case 'USD':
    case 'FIAT':
      return baseToStandard
        ? { value: new BigNumber(value).dividedBy(100).valueOf() }
        : { value: new BigNumber(value).multipliedBy(100).valueOf() }
  }
}

// =====================================================================
// =============================== STRING ==============================
// =====================================================================
const displayFiatToBtc = ({
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
  return transformFiatToBtc({ value, fromCurrency, toUnit, rates })
    .map(Currency.coinToString)
    .getOrElse(DefaultDisplay)
}

const displayBtcToFiat = ({
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
  return transformBtcToFiat({ value, fromUnit, toCurrency, rates })
    .map(Currency.unsafe_deprecated_fiatToString)
    .getOrElse(DefaultDisplay)
}

const displayBtcToBtc = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformBtcToBtc({ value, fromUnit, toUnit })
    .map(Currency.coinToString)
    .getOrElse(DefaultDisplay)
}

const displayDotToFiat = ({
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
  return transformDotToFiat({ value, fromUnit, toCurrency, rates })
    .map(Currency.unsafe_deprecated_fiatToString)
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

const displayEtherToFiat = ({
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
  return transformEtherToFiat({ value, fromUnit, toCurrency, rates })
    .map(Currency.unsafe_deprecated_fiatToString)
    .getOrElse(DefaultDisplay)
}

const displayPaxToFiat = ({
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
  return transformPaxToFiat({ value, fromUnit, toCurrency, rates })
    .map(Currency.unsafe_deprecated_fiatToString)
    .getOrElse(DefaultDisplay)
}

const displayAaveToFiat = ({
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
  return transformAaveToFiat({ value, fromUnit, toCurrency, rates })
    .map(Currency.unsafe_deprecated_fiatToString)
    .getOrElse(DefaultDisplay)
}

const displayYfiToFiat = ({
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
  return transformYfiToFiat({ value, fromUnit, toCurrency, rates })
    .map(Currency.unsafe_deprecated_fiatToString)
    .getOrElse(DefaultDisplay)
}

const displayUsdtToFiat = ({
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
  return transformUsdtToFiat({ value, fromUnit, toCurrency, rates })
    .map(Currency.unsafe_deprecated_fiatToString)
    .getOrElse(DefaultDisplay)
}

const displayWdgldToFiat = ({
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
  return transformWdgldToFiat({ value, fromUnit, toCurrency, rates })
    .map(Currency.unsafe_deprecated_fiatToString)
    .getOrElse(DefaultDisplay)
}

const displayEtherToEther = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformEtherToEther({ value, fromUnit, toUnit })
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
  return transformPaxToPax({ value, fromUnit, toUnit })
    .map(x => Currency.coinToString({ ...x, minDigits: 2, maxDigits: 2 }))
    .getOrElse(DefaultDisplay)
}

const displayAaveToAave = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformAaveToAave({ value, fromUnit, toUnit })
    .map(x => Currency.coinToString({ ...x, minDigits: 2, maxDigits: 8 }))
    .getOrElse(DefaultDisplay)
}

const displayYfiToYfi = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformYfiToYfi({ value, fromUnit, toUnit })
    .map(x => Currency.coinToString({ ...x, minDigits: 2, maxDigits: 8 }))
    .getOrElse(DefaultDisplay)
}

const displayUsdtToUsdt = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformUsdtToUsdt({ value, fromUnit, toUnit })
    .map(x => Currency.coinToString({ ...x, minDigits: 2, maxDigits: 2 }))
    .getOrElse(DefaultDisplay)
}

const displayWdgldToWdgld = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformWdgldToWdgld({ value, fromUnit, toUnit })
    .map(Currency.coinToString)
    .getOrElse(DefaultDisplay)
}

const displayBchToFiat = ({
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
  return transformBchToFiat({ value, fromUnit, toCurrency, rates })
    .map(Currency.unsafe_deprecated_fiatToString)
    .getOrElse(DefaultDisplay)
}

const displayBchToBch = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformBchToBch({ value, fromUnit, toUnit })
    .map(Currency.coinToString)
    .getOrElse(DefaultDisplay)
}

const displayXlmToFiat = ({
  digits = 2,
  fromUnit,
  rates,
  toCurrency,
  value
}) => {
  return transformXlmToFiat({ value, fromUnit, toCurrency, rates, digits })
    .map(assoc('digits', digits))
    .map(Currency.unsafe_deprecated_fiatToString)
    .getOrElse(DefaultDisplay)
}

const displayXlmToXlm = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformXlmToXlm({ value, fromUnit, toUnit })
    .map(Currency.coinToString)
    .getOrElse(DefaultDisplay)
}

const displayAlgoToFiat = ({
  digits = 2,
  fromUnit,
  rates,
  toCurrency,
  value
}) => {
  return transformAlgoToFiat({ value, fromUnit, toCurrency, rates, digits })
    .map(assoc('digits', digits))
    .map(Currency.unsafe_deprecated_fiatToString)
    .getOrElse(DefaultDisplay)
}

const displayAlgoToAlgo = ({
  fromUnit,
  toUnit,
  value
}: {
  fromUnit: UnitType
  toUnit: UnitType
  value: number | string
}) => {
  return transformAlgoToAlgo({ value, fromUnit, toUnit })
    .map(x => Currency.coinToString({ ...x, minDigits: 2 }))
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
  switch (fromCoin) {
    case 'AAVE':
      return displayAaveToFiat({ value, fromUnit, toCurrency, rates })
    case 'ALGO':
      return displayAlgoToFiat({ value, fromUnit, toCurrency, rates })
    case 'BCH':
      return displayBchToFiat({ value, fromUnit, toCurrency, rates })
    case 'BTC':
      return displayBtcToFiat({ value, fromUnit, toCurrency, rates })
    case 'DOT':
      return displayDotToFiat({ value, fromUnit, toCurrency, rates })
    case 'ETH':
      return displayEtherToFiat({ value, fromUnit, toCurrency, rates })
    case 'PAX':
      return displayPaxToFiat({ value, fromUnit, toCurrency, rates })
    case 'USDT':
      return displayUsdtToFiat({ value, fromUnit, toCurrency, rates })
    case 'WDGLD':
      return displayWdgldToFiat({ value, fromUnit, toCurrency, rates })
    case 'XLM':
      return displayXlmToFiat({ value, fromUnit, toCurrency, rates })
    case 'YFI':
      return displayYfiToFiat({ value, fromUnit, toCurrency, rates })
    default:
      return 'Unsupported Coin Code'
  }
}

const displayFiatToFiat = ({ value }: { value: number | string }) => {
  return new BigNumber(value).toFixed(2)
}

const getSymbol = currency => {
  const data = Currencies[currency]
  const tradeUnit = prop('trade', data)
  return path(['units', tradeUnit, 'symbol'], data)
}

const convertFiatToCoin = (
  value: number | string,
  unit: UnitType,
  currency: keyof CurrenciesType,
  rates: RatesType
) => {
  switch (true) {
    case unit === 'AAVE':
      return convertFiatToAave({
        value,
        fromCurrency: currency,
        toUnit: unit,
        rates: rates
      }).value
    case unit === 'ALGO':
      return convertFiatToAlgo({
        value,
        fromCurrency: currency,
        toUnit: unit,
        rates: rates
      }).value
    case unit === 'BCH':
      return convertFiatToBch({
        value,
        fromCurrency: currency,
        toUnit: unit,
        rates: rates
      }).value
    case unit === 'BTC':
      return convertFiatToBtc({
        value,
        fromCurrency: currency,
        toUnit: unit,
        rates: rates
      }).value
    case unit === 'DOT':
      return convertFiatToDot({
        value,
        fromCurrency: currency,
        toUnit: unit,
        rates: rates
      }).value
    case unit === 'ETH':
      return convertFiatToEther({
        value,
        fromCurrency: currency,
        toUnit: unit,
        rates: rates
      }).value
    case unit === 'PAX':
      return convertFiatToPax({
        value,
        fromCurrency: currency,
        toUnit: unit,
        rates: rates
      }).value
    case unit === 'USDT':
      return convertFiatToUsdt({
        value,
        fromCurrency: currency,
        toUnit: unit,
        rates: rates
      }).value
    case unit === 'WDGLD':
      return convertFiatToWdgld({
        value,
        fromCurrency: currency,
        toUnit: unit,
        rates: rates
      }).value
    case unit === 'XLM':
      return convertFiatToXlm({
        value,
        fromCurrency: currency,
        toUnit: unit,
        rates: rates
      }).value
    case unit === 'YFI':
      return convertFiatToYfi({
        value,
        fromCurrency: currency,
        toUnit: unit,
        rates: rates
      }).value
    default:
      return 'Unsupported Coin Code'
  }
}

const convertCoinToFiat = (
  value: number | string,
  unit: UnitType,
  currency: keyof CurrenciesType,
  rates: RatesType
) => {
  switch (true) {
    case unit === 'AAVE':
      return convertAaveToFiat({
        value,
        toCurrency: currency,
        fromUnit: unit,
        rates: rates
      }).value
    case unit === 'ALGO':
      return convertAlgoToFiat({
        value,
        toCurrency: currency,
        fromUnit: unit,
        rates: rates
      }).value
    case unit === 'BCH':
      return convertBchToFiat({
        value,
        toCurrency: currency,
        fromUnit: unit,
        rates: rates
      }).value
    case unit === 'BTC':
      return convertBtcToFiat({
        value,
        toCurrency: currency,
        fromUnit: unit,
        rates: rates
      }).value
    case unit === 'DOT':
      return convertDotToFiat({
        value,
        toCurrency: currency,
        fromUnit: unit,
        rates: rates
      }).value
    case unit === 'ETH':
      return convertEthToFiat({
        value,
        toCurrency: currency,
        fromUnit: unit,
        rates: rates
      }).value
    case unit === 'PAX':
      return convertPaxToFiat({
        value,
        toCurrency: currency,
        fromUnit: unit,
        rates: rates
      }).value
    case unit === 'USDT':
      return convertUsdtToFiat({
        value,
        toCurrency: currency,
        fromUnit: unit,
        rates: rates
      }).value
    case unit === 'WDGLD':
      return convertWdgldToFiat({
        value,
        toCurrency: currency,
        fromUnit: unit,
        rates: rates
      }).value
    case unit === 'XLM':
      return convertXlmToFiat({
        value,
        toCurrency: currency,
        fromUnit: unit,
        rates: rates
      }).value
    case unit === 'YFI':
      return convertYfiToFiat({
        value,
        toCurrency: currency,
        fromUnit: unit,
        rates: rates
      }).value
    default:
      return 'Unsupported Coin Code'
  }
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

const displayCoinToCoin = (
  value: number | string,
  toUnit: WalletCurrencyType
) => {
  switch (toUnit) {
    case 'AAVE':
      const aaveAmount = convertAaveToAave({ value, fromUnit: 'WEI', toUnit })
      return displayAaveToAave({
        value: Number(aaveAmount.value).toFixed(8),
        fromUnit: 'AAVE',
        toUnit
      })
    case 'ALGO':
      return displayAlgoToAlgo({
        fromUnit: 'mALGO',
        toUnit,
        value
      })
    case 'BCH':
      return displayBchToBch({
        fromUnit: 'SAT',
        toUnit,
        value
      })
    case 'BTC':
      return displayBtcToBtc({
        fromUnit: 'SAT',
        toUnit,
        value
      })
    case 'DOT':
      return displayDotToDot({
        fromUnit: 'PLANCK',
        toUnit,
        value
      })
    case 'ETH':
      const ethAmount = convertEtherToEther({ value, fromUnit: 'WEI', toUnit })
      return displayEtherToEther({
        value: Number(ethAmount.value).toFixed(8),
        fromUnit: 'ETH',
        toUnit
      })
    case 'PAX':
      const paxAmount = convertPaxToPax({ value, fromUnit: 'WEI', toUnit })
      return displayPaxToPax({
        value: Number(paxAmount.value).toFixed(8),
        fromUnit: 'PAX',
        toUnit
      })
    case 'USDT':
      const usdtAmount = convertUsdtToUsdt({ value, fromUnit: 'WEI', toUnit })
      return displayUsdtToUsdt({
        value: Number(usdtAmount.value).toFixed(8),
        fromUnit: 'USDT',
        toUnit
      })
    case 'WDGLD':
      const wdgldAmount = convertWdgldToWdgld({
        value,
        fromUnit: 'WEI',
        toUnit
      })
      return displayWdgldToWdgld({
        value: Number(wdgldAmount.value).toFixed(8),
        fromUnit: 'WDGLD',
        toUnit
      })
    case 'XLM':
      return displayXlmToXlm({
        fromUnit: 'STROOP',
        toUnit,
        value
      })
    case 'YFI':
      const yfiAmount = convertYfiToYfi({ value, fromUnit: 'WEI', toUnit })
      return displayYfiToYfi({
        value: Number(yfiAmount.value).toFixed(8),
        fromUnit: 'YFI',
        toUnit
      })
    case 'EUR':
    case 'GBP':
    case 'USD':
      return Currency.fiatToString({ value, unit: toUnit })
    default:
      return 'Coin not supported'
  }
}

export const convertCoinToCoinFromTransaction = (coin, tx) => {
  switch (coin) {
    case 'PAX':
      return convertPaxToPax({
        value: tx.amount,
        fromUnit: 'WEI',
        toUnit: 'PAX'
      }).value
    case 'USDT':
      return convertUsdtToUsdt({
        value: tx.amount,
        fromUnit: 'WEI',
        toUnit: 'USDT'
      }).value
    case 'WDGLD':
      return convertWdgldToWdgld({
        value: tx.amount,
        fromUnit: 'WEI',
        toUnit: 'WDGLD'
      }).value
    case 'AAVE':
      return convertAaveToAave({
        value: tx.amount,
        fromUnit: 'WEI',
        toUnit: 'AAVE'
      }).value
    case 'YFI':
      return convertYfiToYfi({
        value: tx.amount,
        fromUnit: 'WEI',
        toUnit: 'YFI'
      }).value
    default:
      return convertEtherToEther({
        value: tx.amount,
        fromUnit: 'WEI',
        toUnit: 'ETH'
      }).value
  }
}

export {
  convertAaveToAave,
  convertAaveToFiat,
  convertAlgoToAlgo,
  convertAlgoToFiat,
  convertBchToBch,
  convertBchToFiat,
  convertBtcToBtc,
  convertBtcToFiat,
  convertCoinToCoin,
  convertCoinToFiat,
  convertCoinUnitToFiat,
  convertDotToDot,
  convertDotToFiat,
  convertEtherToEther,
  convertEthToFiat,
  convertFiatToBch,
  convertFiatToBtc,
  convertFiatToCoin,
  convertFiatToEther,
  convertFiatToFiat,
  convertFiatToXlm,
  convertPaxToFiat,
  convertPaxToPax,
  convertUsdtToFiat,
  convertUsdtToUsdt,
  convertWdgldToFiat,
  convertWdgldToWdgld,
  convertXlmToFiat,
  convertXlmToXlm,
  convertYfiToFiat,
  convertYfiToYfi,
  DefaultConversion,
  DefaultDisplay,
  displayAaveToAave,
  displayAaveToFiat,
  displayAlgoToAlgo,
  displayAlgoToFiat,
  displayBchToBch,
  displayBchToFiat,
  displayBtcToBtc,
  displayBtcToFiat,
  displayCoinToCoin,
  displayCoinToFiat,
  displayDotToDot,
  displayDotToFiat,
  displayEtherToEther,
  displayEtherToFiat,
  displayFiatToBtc,
  displayFiatToFiat,
  displayPaxToPax,
  displayUsdtToUsdt,
  displayWdgldToWdgld,
  displayXlmToFiat,
  displayXlmToXlm,
  displayYfiToFiat,
  displayYfiToYfi,
  getSymbol
}
