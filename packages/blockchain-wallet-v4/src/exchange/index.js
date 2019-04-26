import { assoc, assocPath, path, prop } from 'ramda'
import * as Currency from './currency'
import * as Pairs from './pairs'
import * as Currencies from './currencies'

const { BCH, BTC, BSV, ETH, PAX, XLM } = Currencies

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
const transformFiatToBtc = ({ value, fromCurrency, toUnit, rates }) => {
  const pairs = Pairs.create(BTC.code, rates)
  const sourceCurrency = prop(fromCurrency, Currencies)
  const sourceCurrencyCode = prop('code', sourceCurrency)
  const sourceCurrencyUnit = path(['units', sourceCurrencyCode], sourceCurrency)
  const targetUnit = path(['units', toUnit], BTC)
  return Currency.fromUnit({ value: value, unit: sourceCurrencyUnit })
    .chain(Currency.convert(pairs, BTC))
    .chain(Currency.toUnit(targetUnit))
}

const transformBtcToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  const pairs = Pairs.create(BTC.code, rates)
  const targetCurrency = prop(toCurrency, Currencies)
  const targetCurrencyCode = prop('code', targetCurrency)
  const targetCurrencyUnit = path(['units', targetCurrencyCode], targetCurrency)
  const sourceUnit = path(['units', fromUnit], BTC)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convert(pairs, targetCurrency))
    .chain(Currency.toUnit(targetCurrencyUnit))
}

const transformBtcToBtc = ({ value, fromUnit, toUnit }) => {
  const sourceUnit = path(['units', fromUnit], BTC)
  const targetUnit = path(['units', toUnit], BTC)
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(
    Currency.toUnit(targetUnit)
  )
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

const transformFiatToPax = ({ value, fromCurrency, toUnit, rates }) => {
  const pairs = Pairs.create(PAX.code, rates)
  const sourceCurrency = prop(fromCurrency, Currencies)
  const sourceCurrencyCode = prop('code', sourceCurrency)
  const sourceCurrencyUnit = path(['units', sourceCurrencyCode], sourceCurrency)
  const targetUnit = path(['units', toUnit], PAX)
  return Currency.fromUnit({ value: value, unit: sourceCurrencyUnit })
    .chain(Currency.convert(pairs, PAX))
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

const transformPaxToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  const pairs = Pairs.create(PAX.code, rates)
  const targetCurrency = prop(toCurrency, Currencies)
  const targetCurrencyCode = prop('code', targetCurrency)
  const targetCurrencyUnit = path(['units', targetCurrencyCode], targetCurrency)
  const sourceUnit = path(['units', fromUnit], PAX)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convert(pairs, targetCurrency))
    .chain(Currency.toUnit(targetCurrencyUnit))
}

const transformEtherToEther = ({ value, fromUnit, toUnit }) => {
  const sourceUnit = path(['units', fromUnit], ETH)
  const targetUnit = path(['units', toUnit], ETH)
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(
    Currency.toUnit(targetUnit)
  )
}

const transformPaxToPax = ({ value, fromUnit, toUnit }) => {
  const sourceUnit = path(['units', fromUnit], PAX)
  const targetUnit = path(['units', toUnit], PAX)
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(
    Currency.toUnit(targetUnit)
  )
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

const transformFiatToBsv = ({ value, fromCurrency, toUnit, rates }) => {
  const pairs = Pairs.create(BSV.code, rates)
  const sourceCurrency = prop(fromCurrency, Currencies)
  const sourceCurrencyCode = prop('code', sourceCurrency)
  const sourceCurrencyUnit = path(['units', sourceCurrencyCode], sourceCurrency)
  const targetUnit = path(['units', toUnit], BSV)
  return Currency.fromUnit({ value: value, unit: sourceCurrencyUnit })
    .chain(Currency.convert(pairs, BSV))
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

const transformBsvToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  const pairs = Pairs.create(BSV.code, rates)
  const targetCurrency = prop(toCurrency, Currencies)
  const targetCurrencyCode = prop('code', targetCurrency)
  const targetCurrencyUnit = path(['units', targetCurrencyCode], targetCurrency)
  const sourceUnit = path(['units', fromUnit], BSV)
  return Currency.fromUnit({ value, unit: sourceUnit })
    .chain(Currency.convert(pairs, targetCurrency))
    .chain(Currency.toUnit(targetCurrencyUnit))
}

const transformBchToBch = ({ value, fromUnit, toUnit }) => {
  const sourceUnit = path(['units', fromUnit], BCH)
  const targetUnit = path(['units', toUnit], BCH)
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(
    Currency.toUnit(targetUnit)
  )
}

const transformBsvToBsv = ({ value, fromUnit, toUnit }) => {
  const sourceUnit = path(['units', fromUnit], BSV)
  const targetUnit = path(['units', toUnit], BSV)
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(
    Currency.toUnit(targetUnit)
  )
}

const transformFiatToXlm = ({ value, fromCurrency, toUnit, rates }) => {
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
  value,
  fromUnit,
  toCurrency,
  rates,
  digits = 2
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

const transformXlmToXlm = ({ value, fromUnit, toUnit }) => {
  const sourceUnit = path(['units', fromUnit], XLM)
  const targetUnit = path(['units', toUnit], XLM)
  return Currency.fromUnit({ value, unit: sourceUnit }).chain(
    Currency.toUnit(targetUnit)
  )
}

// =====================================================================
// ============================== DECIMALS =============================
// =====================================================================
const convertFiatToBtc = ({ value, fromCurrency, toUnit, rates }) => {
  return transformFiatToBtc({
    value,
    fromCurrency,
    toUnit,
    rates
  }).getOrElse(DefaultConversion)
}

const convertBtcToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  return transformBtcToFiat({
    value,
    fromUnit,
    toCurrency,
    rates
  }).getOrElse(DefaultConversion)
}

const convertBtcToBtc = ({ value, fromUnit, toUnit }) => {
  return transformBtcToBtc({ value, fromUnit, toUnit }).getOrElse(
    DefaultConversion
  )
}

const convertFiatToEther = ({ value, fromCurrency, toUnit, rates }) => {
  return transformFiatToEther({ value, fromCurrency, toUnit, rates }).getOrElse(
    DefaultConversion
  )
}

const convertFiatToPax = ({ value, fromCurrency, toUnit, rates }) => {
  return transformFiatToPax({ value, fromCurrency, toUnit, rates }).getOrElse(
    DefaultConversion
  )
}

const convertEtherToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  return transformEtherToFiat({ value, fromUnit, toCurrency, rates }).getOrElse(
    DefaultConversion
  )
}

const convertPaxToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  return transformPaxToFiat({ value, fromUnit, toCurrency, rates }).getOrElse(
    DefaultConversion
  )
}

const convertEtherToEther = ({ value, fromUnit, toUnit }) => {
  return transformEtherToEther({ value, fromUnit, toUnit }).getOrElse(
    DefaultConversion
  )
}

const convertPaxToPax = ({ value, fromUnit, toUnit }) => {
  return transformPaxToPax({ value, fromUnit, toUnit }).getOrElse(
    DefaultConversion
  )
}

const convertFiatToBch = ({ value, fromCurrency, toUnit, rates }) => {
  return transformFiatToBch({ value, fromCurrency, toUnit, rates }).getOrElse(
    DefaultConversion
  )
}

const convertFiatToBsv = ({ value, fromCurrency, toUnit, rates }) => {
  return transformFiatToBsv({ value, fromCurrency, toUnit, rates }).getOrElse(
    DefaultConversion
  )
}

const convertBchToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  return transformBchToFiat({ value, fromUnit, toCurrency, rates }).getOrElse(
    DefaultConversion
  )
}

const convertBsvToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  return transformBsvToFiat({ value, fromUnit, toCurrency, rates }).getOrElse(
    DefaultConversion
  )
}

const convertBchToBch = ({ value, fromUnit, toUnit }) => {
  return transformBchToBch({ value, fromUnit, toUnit }).getOrElse(
    DefaultConversion
  )
}

const convertBsvToBsv = ({ value, fromUnit, toUnit }) => {
  return transformBsvToBsv({ value, fromUnit, toUnit }).getOrElse(
    DefaultConversion
  )
}

const convertFiatToXlm = ({ value, fromCurrency, toUnit, rates }) => {
  return transformFiatToXlm({ value, fromCurrency, toUnit, rates }).getOrElse(
    DefaultConversion
  )
}

const convertXlmToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  return transformXlmToFiat({ value, fromUnit, toCurrency, rates }).getOrElse(
    DefaultConversion
  )
}

const convertXlmToXlm = ({ value, fromUnit, toUnit }) => {
  return transformXlmToXlm({ value, fromUnit, toUnit }).getOrElse(
    DefaultConversion
  )
}

const convertCoinUnitToFiat = ({
  coin,
  value,
  fromUnit,
  toCurrency,
  rates
}) => {
  switch (coin) {
    case 'BTC':
      return transformBtcToFiat({
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
    case 'BCH':
      return transformBchToFiat({
        value,
        fromUnit,
        toCurrency,
        rates
      }).getOrElse(DefaultConversion)
    case 'BSV':
      return transformBsvToFiat({
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
    default:
      return 'Unsupported Coin Code'
  }
}

const convertCoinToCoin = ({ value, coin, baseToStandard }) => {
  switch (coin) {
    case 'BTC':
      return baseToStandard
        ? convertBtcToBtc({ value, fromUnit: 'SAT', toUnit: 'BTC' })
        : convertBtcToBtc({ value, fromUnit: 'BTC', toUnit: 'SAT' })
    case 'ETH':
      return baseToStandard
        ? convertEtherToEther({ value, fromUnit: 'WEI', toUnit: 'ETH' })
        : convertEtherToEther({ value, fromUnit: 'ETH', toUnit: 'WEI' })
    case 'PAX':
      return baseToStandard
        ? convertPaxToPax({ value, fromUnit: 'WEI', toUnit: 'PAX' })
        : convertPaxToPax({ value, fromUnit: 'PAX', toUnit: 'WEI' })
    case 'BCH':
      return baseToStandard
        ? convertBchToBch({ value, fromUnit: 'SAT', toUnit: 'BCH' })
        : convertBchToBch({ value, fromUnit: 'BCH', toUnit: 'SAT' })
    case 'BSV':
      return baseToStandard
        ? convertBsvToBsv({ value, fromUnit: 'SAT', toUnit: 'BSV' })
        : convertBsvToBsv({ value, fromUnit: 'BSV', toUnit: 'SAT' })
    case 'XLM':
      return baseToStandard
        ? convertXlmToXlm({ value, fromUnit: 'STROOP', toUnit: 'XLM' })
        : convertXlmToXlm({ value, fromUnit: 'XLM', toUnit: 'STROOP' })
  }
}

// =====================================================================
// =============================== STRING ==============================
// =====================================================================
const displayFiatToBtc = ({ value, fromCurrency, toUnit, rates }) => {
  return transformFiatToBtc({ value, fromCurrency, toUnit, rates })
    .map(Currency.coinToString)
    .getOrElse(DefaultDisplay)
}

const displayBtcToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  return transformBtcToFiat({ value, fromUnit, toCurrency, rates })
    .map(Currency.fiatToString)
    .getOrElse(DefaultDisplay)
}

const displayBtcToBtc = ({ value, fromUnit, toUnit }) => {
  return transformBtcToBtc({ value, fromUnit, toUnit })
    .map(Currency.coinToString)
    .getOrElse(DefaultDisplay)
}

const displayEtherToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  return transformEtherToFiat({ value, fromUnit, toCurrency, rates })
    .map(Currency.fiatToString)
    .getOrElse(DefaultDisplay)
}

const displayPaxToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  return transformPaxToFiat({ value, fromUnit, toCurrency, rates })
    .map(Currency.fiatToString)
    .getOrElse(DefaultDisplay)
}

const displayEtherToEther = ({ value, fromUnit, toUnit }) => {
  return transformEtherToEther({ value, fromUnit, toUnit })
    .map(Currency.coinToString)
    .getOrElse(DefaultDisplay)
}

const displayPaxToPax = ({ value, fromUnit, toUnit }) => {
  return transformPaxToPax({ value, fromUnit, toUnit })
    .map(Currency.coinToString)
    .getOrElse(DefaultDisplay)
}

const displayBchToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  return transformBchToFiat({ value, fromUnit, toCurrency, rates })
    .map(Currency.fiatToString)
    .getOrElse(DefaultDisplay)
}

const displayBsvToFiat = ({ value, fromUnit, toCurrency, rates }) => {
  return transformBsvToFiat({ value, fromUnit, toCurrency, rates })
    .map(Currency.fiatToString)
    .getOrElse(DefaultDisplay)
}

const displayBchToBch = ({ value, fromUnit, toUnit }) => {
  return transformBchToBch({ value, fromUnit, toUnit })
    .map(Currency.coinToString)
    .getOrElse(DefaultDisplay)
}

const displayBsvToBsv = ({ value, fromUnit, toUnit }) => {
  return transformBsvToBsv({ value, fromUnit, toUnit })
    .map(Currency.coinToString)
    .getOrElse(DefaultDisplay)
}

const displayXlmToFiat = ({
  value,
  fromUnit,
  toCurrency,
  rates,
  digits = 2
}) => {
  return transformXlmToFiat({ value, fromUnit, toCurrency, rates, digits })
    .map(assoc('digits', digits))
    .map(Currency.fiatToString)
    .getOrElse(DefaultDisplay)
}

const displayXlmToXlm = ({ value, fromUnit, toUnit }) => {
  return transformXlmToXlm({ value, fromUnit, toUnit })
    .map(Currency.coinToString)
    .getOrElse(DefaultDisplay)
}

const displayCoinToFiat = ({
  fromCoin,
  value,
  fromUnit,
  toCurrency,
  rates
}) => {
  switch (fromCoin) {
    case 'BTC':
      return displayBtcToFiat({ value, fromUnit, toCurrency, rates })
    case 'ETH':
      return displayEtherToFiat({ value, fromUnit, toCurrency, rates })
    case 'PAX':
      return displayPaxToFiat({ value, fromUnit, toCurrency, rates })
    case 'BCH':
      return displayBchToFiat({ value, fromUnit, toCurrency, rates })
    case 'BSV':
      return displayBsvToFiat({ value, fromUnit, toCurrency, rates })
    case 'XLM':
      return displayXlmToFiat({ value, fromUnit, toCurrency, rates })
    default:
      return 'Unsupported Coin Code'
  }
}

const displayFiatToFiat = ({ value }) => {
  return value.toFixed(2)
}

const getSymbol = currency => {
  const data = Currencies[currency]
  const tradeUnit = prop('trade', data)
  return path(['units', tradeUnit, 'symbol'], data)
}

const convertFiatToCoin = (value, unit, currency, rates) => {
  switch (true) {
    case unit === 'BTC':
      return convertFiatToBtc({
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
    case unit === 'BCH':
      return convertFiatToBch({
        value,
        fromCurrency: currency,
        toUnit: unit,
        rates: rates
      }).value
    case unit === 'BSV':
      return convertFiatToBsv({
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
    default:
      return 'Unsupported Coin Code'
  }
}

const convertCoinToFiat = (value, unit, currency, rates) => {
  switch (true) {
    case unit === 'BTC':
      return convertBtcToFiat({
        value,
        toCurrency: currency,
        fromUnit: unit,
        rates: rates
      }).value
    case unit === 'ETH':
      return convertEtherToFiat({
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
    case unit === 'BCH':
      return convertBchToFiat({
        value,
        toCurrency: currency,
        fromUnit: unit,
        rates: rates
      }).value
    case unit === 'BSV':
      return convertBsvToFiat({
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
    default:
      return 'Unsupported Coin Code'
  }
}

const displayCoinToCoin = (value, toUnit) => {
  switch (toUnit) {
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
    case 'BSV':
      return displayBsvToBsv({
        fromUnit: 'SAT',
        toUnit,
        value
      })
    case 'PAX':
      const paxAmount = convertPaxToPax({ value, fromUnit: 'WEI', toUnit })
      return displayPaxToPax({
        value: Number(paxAmount.value).toFixed(8),
        fromUnit: 'PAX',
        toUnit
      })
    case 'ETH':
      const ethAmount = convertEtherToEther({ value, fromUnit: 'WEI', toUnit })
      return displayEtherToEther({
        value: Number(ethAmount.value).toFixed(8),
        fromUnit: 'ETH',
        toUnit
      })
    case 'XLM':
      return displayXlmToXlm({
        fromUnit: 'STROOP',
        toUnit,
        value
      })
  }
}
// TODO: clean up public vs private exports, should just export the following
// convertFiatToCoin
// convertCoinToFiat
// convertFiatToCoin
// convertCoinToCoin
// displayFiatToCoin
// displayCoinToFiat
export {
  DefaultConversion,
  DefaultDisplay,
  convertFiatToCoin,
  convertCoinToFiat,
  convertBtcToFiat,
  convertBtcToBtc,
  convertBchToFiat,
  convertBchToBch,
  convertBsvToFiat,
  convertBsvToBsv,
  convertEtherToFiat,
  convertEtherToEther,
  convertFiatToBtc,
  convertFiatToEther,
  convertFiatToBch,
  convertFiatToBsv,
  convertFiatToXlm,
  convertPaxToFiat,
  convertPaxToPax,
  convertXlmToFiat,
  convertXlmToXlm,
  convertCoinToCoin,
  displayBtcToFiat,
  displayBtcToBtc,
  displayBchToFiat,
  displayBchToBch,
  displayBsvToBsv,
  displayEtherToFiat,
  displayEtherToEther,
  displayFiatToBtc,
  displayPaxToPax,
  displayXlmToFiat,
  displayXlmToXlm,
  displayCoinToCoin,
  displayCoinToFiat,
  displayFiatToFiat,
  getSymbol,
  convertCoinUnitToFiat
}
