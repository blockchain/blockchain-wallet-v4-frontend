import { path, prop } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'

const { Currencies, Currency, Pairs } = Exchange
const { BTC, ETH } = Currencies

const convertBaseCoinToFiat = (currency, rates, value) => {
  const CUR = prop(currency, Currencies)
  const CURCode = prop('code', CUR)
  const CURunit = path(['units', CURCode], CUR)
  const pairs = Pairs.create(BTC.code, rates)
  const btcAmount = Currency.fromUnit({value, unit: BTC.units.SAT})

  return btcAmount.chain(Currency.convert(pairs, CUR)).chain(Currency.toUnit(CURunit)).map(Currency.unitToString).getOrElse('N/A')
}

const convertBaseCoinToCoin = (coin, unit, value) => {
  const coinUnit = coin === 'BTC' ? path(['units', unit], BTC) : path(['units', unit], ETH)
  const coinAmount = coin === 'BTC' ? Currency.fromUnit({ value, unit: BTC.units.SAT }) : Currency.fromUnit({ value, unit: ETH.units.WEI })
  return coinAmount.chain(Currency.toUnit(coinUnit)).map(Currency.unitToString).getOrElse('N/A')
}

// =============================================================================
// ================================= BITCOIN ===================================
// =============================================================================
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

const convertBtcUnitToBtcUnit = (value, fromUnit, toUnit) => {
  const fromAmount = Currency.fromUnit({ value, unit: BTC.units[fromUnit] })
  return fromAmount.chain(Currency.toUnit(BTC.units[toUnit])).getOrElse({ value: undefined })
}

export {
  convertBaseCoinToFiat,
  convertBaseCoinToCoin,
  convertUnitToFiat,
  convertFiatToUnit,
  convertSatoshisToUnit,
  convertUnitToSatoshis,
  convertBtcUnitToBtcUnit
}
