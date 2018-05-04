import { path, prop } from 'ramda'
import * as Currency from './currency'
import * as Pairs from './pairs'
import * as Currencies from './currencies'

const { BCH, BTC, ETH } = Currencies

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

const transformBitcoinToEther = ({ value, fromUnit, toUnit, rate, reverse }) => {
  const targetUnit = path(['units', toUnit], ETH)
  const sourceUnit = path(['units', fromUnit], BTC)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convertWithRate(ETH, rate, reverse))
    .chain(Currency.toUnit(targetUnit))
}

const transformEtherToBitcoin = ({ value, fromUnit, toUnit, rate, reverse }) => {
  const targetUnit = path(['units', toUnit], BTC)
  const sourceUnit = path(['units', fromUnit], ETH)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convertWithRate(BTC, rate, reverse))
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

const transformBitcoinToBch = ({ value, fromUnit, toUnit, rate, reverse }) => {
  const targetUnit = path(['units', toUnit], BCH)
  const sourceUnit = path(['units', fromUnit], BTC)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convertWithRate(BCH, rate, reverse))
    .chain(Currency.toUnit(targetUnit))
}

const transformBchToBitcoin = ({ value, fromUnit, toUnit, rate, reverse }) => {
  const targetUnit = path(['units', toUnit], BTC)
  const sourceUnit = path(['units', fromUnit], BCH)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convertWithRate(BTC, rate, reverse))
    .chain(Currency.toUnit(targetUnit))
}

const transformFiatToBch = ({ value, fromCurrency, toUnit, rates }) => {
  const pairs = Pairs.create(BCH.code, rates)
  const sourceCurrency = prop(fromCurrency, Currencies)
  const sourceCurrencyCode = prop('code', sourceCurrency)
  const sourceCurrencyUnit = path(['units', sourceCurrencyCode], sourceCurrency)
  const targetUnit = path(['units', toUnit], BCH)
  return Currency.fromUnit({ value: value, unit: sourceCurrencyUnit })
    .chain(Currency.convert(pairs, BCH))
    .chain(Currency.toUnit(targetUnit))
}

const transformBchToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  const pairs = Pairs.create(BCH.code, rates)
  const targetCurrency = prop(toCurrency, Currencies)
  const targetCurrencyCode = prop('code', targetCurrency)
  const targetCurrencyUnit = path(['units', targetCurrencyCode], targetCurrency)
  const sourceUnit = path(['units', fromUnit], BCH)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convert(pairs, targetCurrency))
    .chain(Currency.toUnit(targetCurrencyUnit))
}

const transformBchToBch = ({ value, fromUnit, toUnit }) => {
  const sourceUnit = path(['units', fromUnit], BCH)
  const targetUnit = path(['units', toUnit], BCH)
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

const convertBitcoinToEther = ({ value, fromUnit, toUnit, rate, reverse }) => {
  return transformBitcoinToEther({ value, fromUnit, toUnit, rate, reverse }).getOrElse(DefaultConversion)
}

const convertEtherToBitcoin = ({ value, fromUnit, toUnit, rate, reverse }) => {
  return transformEtherToBitcoin({ value, fromUnit, toUnit, rate, reverse }).getOrElse(DefaultConversion)
}

const convertFiatToBch = ({ value, fromCurrency, toUnit, rates }) => {
  return transformFiatToBch({ value, fromCurrency, toUnit, rates }).getOrElse(DefaultConversion)
}

const convertBchToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  return transformBchToFiat({ value, fromUnit, toCurrency, rates }).getOrElse(DefaultConversion)
}

const convertBchToBch = ({ value, fromUnit, toUnit }) => {
  return transformBchToBch({ value, fromUnit, toUnit }).getOrElse(DefaultConversion)
}

const convertBitcoinToBch = ({ value, fromUnit, toUnit, rate, reverse }) => {
  return transformBitcoinToBch({ value, fromUnit, toUnit, rate, reverse }).getOrElse(DefaultConversion)
}

const convertBchToBitcoin = ({ value, fromUnit, toUnit, rate, reverse }) => {
  return transformBchToBitcoin({ value, fromUnit, toUnit, rate, reverse }).getOrElse(DefaultConversion)
}

const convertCoinToCoin = ({ value, coin, baseToStandard }) => {
  switch (coin) {
    case 'BTC': return baseToStandard
      ? convertBitcoinToBitcoin({ value, fromUnit: 'SAT', toUnit: 'BTC' })
      : convertBitcoinToBitcoin({ value, fromUnit: 'BTC', toUnit: 'SAT' })
    case 'ETH': return baseToStandard
      ? convertEtherToEther({ value, fromUnit: 'WEI', toUnit: 'ETH' })
      : convertEtherToEther({ value, fromUnit: 'ETH', toUnit: 'WEI' })
    case 'BCH': return baseToStandard
      ? convertBchToBch({ value, fromUnit: 'SAT', toUnit: 'BCH' })
      : convertBchToBch({ value, fromUnit: 'BCH', toUnit: 'SAT' })
  }
}

// =====================================================================
// =============================== STRING ==============================
// =====================================================================
const displayFiatToBitcoin = ({ value, fromCurrency, toUnit, rates }) => {
  return transformFiatToBitcoin({ value, fromCurrency, toUnit, rates }).map(Currency.coinToString).getOrElse(DefaultDisplay)
}

const displayBitcoinToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  return transformBitcoinToFiat({ value, fromUnit, toCurrency, rates }).map(Currency.fiatToString).getOrElse(DefaultDisplay)
}

const displayBitcoinToBitcoin = ({ value, fromUnit, toUnit }) => {
  return transformBitcoinToBitcoin({ value, fromUnit, toUnit }).map(Currency.coinToString).getOrElse(DefaultDisplay)
}

const displayFiatToEther = ({ value, fromCurrency, toUnit, rates }) => {
  return transformFiatToEther({ value, fromCurrency, toUnit, rates }).map(Currency.coinToString).getOrElse(DefaultDisplay)
}

const displayEtherToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  return transformEtherToFiat({ value, fromUnit, toCurrency, rates }).map(Currency.fiatToString).getOrElse(DefaultDisplay)
}

const displayEtherToEther = ({ value, fromUnit, toUnit }) => {
  return transformEtherToEther({ value, fromUnit, toUnit }).map(Currency.coinToString).getOrElse(DefaultDisplay)
}

const displayBitcoinToEther = ({ value, fromUnit, toUnit, rate, reverse }) => {
  return transformBitcoinToEther({ value, fromUnit, toUnit, rate, reverse }).map(Currency.coinToString).getOrElse(DefaultDisplay)
}

const displayEtherToBitcoin = ({ value, fromUnit, toUnit, rate, reverse }) => {
  return transformEtherToBitcoin({ value, fromUnit, toUnit, rate, reverse }).map(Currency.coinToString).getOrElse(DefaultDisplay)
}

const displayFiatToBch = ({ value, fromCurrency, toUnit, rates }) => {
  return transformFiatToBch({ value, fromCurrency, toUnit, rates }).map(Currency.coinToString).getOrElse(DefaultDisplay)
}

const displayBchToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  return transformBchToFiat({ value, fromUnit, toCurrency, rates }).map(Currency.fiatToString).getOrElse(DefaultDisplay)
}

const displayBchToBch = ({ value, fromUnit, toUnit }) => {
  return transformBchToBch({ value, fromUnit, toUnit }).map(Currency.coinToString).getOrElse(DefaultDisplay)
}

const displayBitcoinToBch = ({ value, fromUnit, toUnit, rate, reverse }) => {
  return transformBitcoinToBch({ value, fromUnit, toUnit, rate, reverse }).map(Currency.coinToString).getOrElse(DefaultDisplay)
}

const displayBchToBitcoin = ({ value, fromUnit, toUnit, rate, reverse }) => {
  return transformBchToBitcoin({ value, fromUnit, toUnit, rate, reverse }).map(Currency.coinToString).getOrElse(DefaultDisplay)
}

const displayCoinToCoin = ({ value, coin, baseToStandard }) => {
  switch (coin) {
    case 'BTC': return baseToStandard
      ? displayBitcoinToBitcoin({ value, fromUnit: 'SAT', toUnit: 'BTC' })
      : displayBitcoinToBitcoin({ value, fromUnit: 'BTC', toUnit: 'SAT' })
    case 'ETH': return baseToStandard
      ? displayEtherToEther({ value, fromUnit: 'WEI', toUnit: 'ETH' })
      : displayEtherToEther({ value, fromUnit: 'ETH', toUnit: 'WEI' })
    case 'BCH': return baseToStandard
      ? displayBchToBch({ value, fromUnit: 'SAT', toUnit: 'BCH' })
      : displayBchToBch({ value, fromUnit: 'BCH', toUnit: 'SAT' })
  }
}

const displayCoinToFiat = ({ fromCoin, value, fromUnit, toCurrency, rates }) => {
  switch (fromCoin) {
    case 'BTC': return displayBitcoinToFiat({ value, fromUnit, toCurrency, rates })
    case 'ETH': return displayEtherToFiat({ value, fromUnit, toCurrency, rates })
    case 'BCH': return displayBchToFiat({ value, fromUnit, toCurrency, rates })
  }
}

const displayFiatToFiat = ({ value }) => {
  return (value).toFixed(2)
}

const getSymbol = currency => {
  const data = Currencies[currency]
  const tradeUnit = prop('trade', data)
  return path(['units', tradeUnit, 'symbol'], data)
}

const formatFiat = (value, currency) => {
  const symbol = getSymbol(currency)
  return `${symbol}${value}`
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
  convertFiatToBch,
  convertBchToFiat,
  convertBchToBch,
  convertBitcoinToBch,
  convertBchToBitcoin,
  convertCoinToCoin,
  displayFiatToBitcoin,
  displayBitcoinToFiat,
  displayBitcoinToBitcoin,
  displayFiatToEther,
  displayEtherToFiat,
  displayEtherToEther,
  displayBitcoinToEther,
  displayEtherToBitcoin,
  displayFiatToBch,
  displayBchToFiat,
  displayBchToBch,
  displayBitcoinToBch,
  displayBchToBitcoin,
  displayCoinToCoin,
  displayCoinToFiat,
  displayFiatToFiat,
  getSymbol,
  formatFiat
}
