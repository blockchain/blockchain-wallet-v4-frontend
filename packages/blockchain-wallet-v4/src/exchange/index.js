import { path, prop } from 'ramda'
import * as Currency from './Currency'
import * as Pairs from './Pairs'
import * as Currencies from './currencies'

const { BTC, ETH } = Currencies

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
const transformFiatToBitcoin = ({ value, fromCurrency, toUnit, rates }) => {
  const pairs = Pairs.create(BTC.code, rates)
  const sourceCurrency = prop(fromCurrency, Currencies)
  const sourceCurrencyCode = prop('code', sourceCurrency)
  const sourceCurrencyUnit = path(['units', sourceCurrencyCode], sourceCurrency)
  const targetUnit = path(['units', toUnit], BTC)
  return Currency.fromUnit({ value: value, unit: sourceCurrencyUnit })
    .chain(Currency.convert(pairs, BTC))
    .chain(Currency.toUnit(targetUnit))
}

const transformBitcoinToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  const pairs = Pairs.create(BTC.code, rates)
  const targetCurrency = prop(toCurrency, Currencies)
  const targetCurrencyCode = prop('code', targetCurrency)
  const targetCurrencyUnit = path(['units', targetCurrencyCode], targetCurrency)
  const sourceUnit = path(['units', fromUnit], BTC)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convert(pairs, targetCurrency))
    .chain(Currency.toUnit(targetCurrencyUnit))
}

const transformBitcoinToEther = ({ value, fromUnit, toUnit, rate }) => {
  const targetUnit = path(['units', toUnit], ETH)
  const sourceUnit = path(['units', fromUnit], BTC)
  // console.log(Currency.fromUnit({ value, unit: sourceUnit }).chain(Currency.convertWithRate(ETH, rate)))
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convertWithRate(ETH, rate))
    .chain(Currency.toUnit(targetUnit))
}

const transformEtherToBitcoin = ({ value, fromUnit, toUnit, rate }) => {
  const targetUnit = path(['units', toUnit], BTC)
  const sourceUnit = path(['units', fromUnit], ETH)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convertWithRate(BTC, rate))
    .chain(Currency.toUnit(targetUnit))
}

const transformBitcoinToBitcoin = ({ value, fromUnit, toUnit }) => {
  const sourceUnit = path(['units', fromUnit], BTC)
  const targetUnit = path(['units', toUnit], BTC)
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(Currency.toUnit(targetUnit))
}

const transformFiatToEther = ({ value, fromCurrency, toUnit, rates }) => {
  const pairs = Pairs.create(ETH.code, rates)
  const sourceCurrency = prop(fromCurrency, Currencies)
  const sourceCurrencyCode = prop('code', sourceCurrency)
  const sourceCurrencyUnit = path(['units', sourceCurrencyCode], sourceCurrency)
  const targetUnit = path(['units', toUnit], ETH)
  return Currency.fromUnit({ value: value, unit: sourceCurrencyUnit })
    .chain(Currency.convert(pairs, ETH))
    .chain(Currency.toUnit(targetUnit))
}

const transformEtherToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  const pairs = Pairs.create(ETH.code, rates)
  const targetCurrency = prop(toCurrency, Currencies)
  const targetCurrencyCode = prop('code', targetCurrency)
  const targetCurrencyUnit = path(['units', targetCurrencyCode], targetCurrency)
  const sourceUnit = path(['units', fromUnit], ETH)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convert(pairs, targetCurrency))
    .chain(Currency.toUnit(targetCurrencyUnit))
}

const transformEtherToEther = ({ value, fromUnit, toUnit }) => {
  const sourceUnit = path(['units', fromUnit], ETH)
  const targetUnit = path(['units', toUnit], ETH)
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(Currency.toUnit(targetUnit))
}

// =====================================================================
// ============================== DECIMALS =============================
// =====================================================================
const convertFiatToBitcoin = ({ value, fromCurrency, toUnit, rates }) => {
  return transformFiatToBitcoin({ value, fromCurrency, toUnit, rates }).getOrElse(DefaultConversion)
}

const convertBitcoinToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  return transformBitcoinToFiat({ value, fromUnit, toCurrency, rates }).getOrElse(DefaultConversion)
}

const convertBitcoinToBitcoin = ({ value, fromUnit, toUnit }) => {
  return transformBitcoinToBitcoin({ value, fromUnit, toUnit }).getOrElse(DefaultConversion)
}

const convertFiatToEther = ({ value, fromCurrency, toUnit, rates }) => {
  return transformFiatToEther({ value, fromCurrency, toUnit, rates }).getOrElse(DefaultConversion)
}

const convertEtherToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  return transformEtherToFiat({ value, fromUnit, toCurrency, rates }).getOrElse(DefaultConversion)
}

const convertEtherToEther = ({ value, fromUnit, toUnit }) => {
  return transformEtherToEther({ value, fromUnit, toUnit }).getOrElse(DefaultConversion)
}

const convertBitcoinToEther = ({ value, fromUnit, toUnit, rate }) => {
  return transformBitcoinToEther({ value, fromUnit, toUnit, rate }).getOrElse(DefaultConversion)
}

const convertEtherToBitcoin = ({ value, fromUnit, toUnit, rate }) => {
  return transformEtherToBitcoin({ value, fromUnit, toUnit, rate }).getOrElse(DefaultConversion)
}

// =====================================================================
// =============================== STRING ==============================
// =====================================================================
const displayFiatToBitcoin = ({ value, fromCurrency, toUnit, rates }) => {
  return transformFiatToBitcoin({ value, fromCurrency, toUnit, rates }).map(Currency.unitToString).getOrElse(DefaultDisplay)
}

const displayBitcoinToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  return transformBitcoinToFiat({ value, fromUnit, toCurrency, rates }).map(Currency.unitToString).getOrElse(DefaultDisplay)
}

const displayBitcoinToBitcoin = ({ value, fromUnit, toUnit }) => {
  return transformBitcoinToBitcoin({ value, fromUnit, toUnit }).map(Currency.unitToString).getOrElse(DefaultDisplay)
}

const displayFiatToEther = ({ value, fromCurrency, toUnit, rates }) => {
  return transformFiatToEther({ value, fromCurrency, toUnit, rates }).map(Currency.unitToString).getOrElse(DefaultDisplay)
}

const displayEtherToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  return transformEtherToFiat({ value, fromUnit, toCurrency, rates }).map(Currency.unitToString).getOrElse(DefaultDisplay)
}

const displayEtherToEther = ({ value, fromUnit, toUnit }) => {
  return transformEtherToEther({ value, fromUnit, toUnit }).map(Currency.unitToString).getOrElse(DefaultDisplay)
}

const displayBitcoinToEther = ({ value, fromUnit, toUnit, rates }) => {
  return transformBitcoinToEther({ value, fromUnit, toUnit, rates }).map(Currency.unitToString).getOrElse(DefaultDisplay)
}

const displayEtherToBitcoin = ({ value, fromUnit, toUnit, rates }) => {
  return transformEtherToBitcoin({ value, fromUnit, toUnit, rates }).map(Currency.unitToString).getOrElse(DefaultDisplay)
}

export {
  DefaultConversion,
  DefaultDisplay,
  convertFiatToBitcoin,
  convertBitcoinToFiat,
  convertBitcoinToBitcoin,
  convertFiatToEther,
  convertEtherToFiat,
  convertEtherToEther,
  convertBitcoinToEther,
  convertEtherToBitcoin,
  displayFiatToBitcoin,
  displayBitcoinToFiat,
  displayBitcoinToBitcoin,
  displayFiatToEther,
  displayEtherToFiat,
  displayEtherToEther,
  displayBitcoinToEther,
  displayEtherToBitcoin
}
