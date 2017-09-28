import { path, prop } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'

const { Currencies, Currency, Pairs } = Exchange
const { BTC } = Currencies

const convertBaseCoinToFiat = (currency, rates, value) => {
  const CUR = prop(currency, Currencies)
  const CURCode = prop('code', CUR)
  const CURunit = path(['units', CURCode], CUR)
  const pairs = Pairs.create(BTC.code, rates)
  const btcAmount = Currency.fromUnit({value, unit: BTC.units.SAT})

  return btcAmount.chain(Currency.convert(pairs, CUR)).chain(Currency.toUnit(CURunit)).map(Currency.unitToString).getOrElse('N/A')
}

const convertBaseCoinToCoin = (unit, value) => {
  const BTCunit = path(['units', unit], BTC)
  const btcAmount = Currency.fromUnit({ value, unit: BTC.units.SAT })

  return btcAmount.chain(Currency.toUnit(BTCunit)).map(Currency.unitToString).getOrElse('N/A')
}

const convertCoinToBaseCoin = (unit, value) => {
  const btcAmount = Currency.fromUnit({ value, unit: BTC.units.SAT })

  return btcAmount.chain(Currency.toUnit(BTC.units[unit])).map(Currency.unitToString).getOrElse('N/A')
}

// Return decimals
const convertUnitToFiat = (unit, currency, rates, value) => {
  const CUR = prop(currency, Currencies)
  const CURCode = prop('code', CUR)
  const CURunit = path(['units', CURCode], CUR)
  const pairs = Pairs.create(BTC.code, rates)
  const btcAmount = Currency.fromUnit({ value: value, unit: BTC.units[unit] })
  const fiatAmount = btcAmount.chain(Currency.convert(pairs, CUR))
  return fiatAmount.chain(Currency.toUnit(CURunit)).getOrElse({ value: undefined })
}

const convertFiatToUnit = (unit, currency, rates, value) => {
  const CUR = prop(currency, Currencies)
  const CURCode = prop('code', CUR)
  const CURunit = path(['units', CURCode], CUR)
  const pairs = Pairs.create(BTC.code, rates)
  const fiatAmount = Currency.fromUnit({ value: value, unit: CURunit })
  const btcAmount = fiatAmount.chain(Currency.convert(pairs, BTC))
  return btcAmount.chain(Currency.toUnit(BTC.units[unit])).getOrElse({ value: undefined })
}

const convertSatoshisToUnit = (value, unit) => {
  const BTCunit = path(['units', unit], BTC)
  const btcAmount = Currency.fromUnit({ value, unit: BTC.units.SAT })
  return btcAmount.chain(Currency.toUnit(BTCunit)).getOrElse({ value: undefined })
}

const convertUnitToSatoshis = (value, unit) => {
  const btcAmount = Currency.fromUnit({ value, unit: BTC.units[unit] })
  return btcAmount.chain(Currency.toUnit(BTC.units.SAT)).getOrElse({ value: undefined })
}

export {
  convertBaseCoinToFiat,
  convertBaseCoinToCoin,
  convertCoinToBaseCoin,
  convertUnitToFiat,
  convertFiatToUnit,
  // Convert Satoshis to specific BTC unit
  convertSatoshisToUnit,
  // Convert specific BTC unit to Satoshis
  convertUnitToSatoshis
}
