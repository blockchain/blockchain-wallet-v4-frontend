import { path, sequence, map } from 'ramda'
import Maybe from 'data.maybe'

// toUnit :: Number -> Number -> Number -> Maybe (Number)
const toUnit = (amount, ratio) => parseFloat(amount * ratio)

// fromUnit :: Number -> Number -> Number -> Maybe (Number)
const fromUnit = (amount, ratio) => parseInt(Math.ceil(amount / ratio))

// toCoin :: Number -> Number -> Number -> Maybe (Number)
const toCoin = (amount, scale, ratio) => parseFloat(amount * scale / ratio)

// fromCoin :: Number -> Number -> Number -> Maybe (Number)
const fromCoin = (amount, scale, ratio) => parseFloat(amount / scale * ratio)

// convert :: String -> Number -> String -> Maybe (Number)
const convertToUnit = (network, amount, unit) => {
  const ratio = getRatio(network, unit)
  const symbol = getSymbol(network, unit)
  return ratio ? Maybe.Just({ amount: toUnit(amount, ratio), symbol }) : Maybe.Nothing()
}

// convertFromUnit :: String -> Number -> String -> Maybe (Number)
const convertFromUnit = (network, amount, unit) => {
  const ratio = getRatio(network, unit)
  const baseUnit = getSymbol(network, 'base')
  return ratio ? Maybe.Just({ amount: fromUnit(amount, ratio), symbol: baseUnit }) : Maybe.Nothing()
}

// Display a coin :: String -> Number -> String -> Maybe (Number)
const displayCoin = (network, amount, unit) => {
  const decimals = path([network, unit, 'decimals'], scale)
  const coin = convertToUnit(network, amount, unit).getOrElse('')
  return coin ? Maybe.fromNullable(`${coin.amount.toFixed(decimals)} ${coin.symbol}`) : Maybe.Nothing()
}

// Display a coin :: String -> Number -> Object -> Maybe (Number)
const displayFiat = (network, amount, currency, rates) => {
  const fiat = convertCoinToFiat(network, amount, currency, rates).getOrElse('')
  return fiat ? Maybe.fromNullable(`${fiat.symbol}${fiat.amount.toFixed(2)}`) : Maybe.Nothing()
}

// convertFromUnit :: String -> Number
const coinScale = network => {
  switch (network) {
    case 'bitcoin': return 100000000
    default: return undefined
  }
}

// convertToCurrency :: String -> Number -> String -> Object -> Maybe({value: Number, symbol:'$'})
const convertCoinToFiat = (network, amount, currency, rates) => {
  const scaleM = Maybe.fromNullable(coinScale(network))
  const dataM = map(x => Maybe.fromNullable(path([currency, x], rates)), ['last', 'symbol'])
  return sequence(Maybe.of, dataM.concat(scaleM))
         .map(([ratio, symbol, scale]) => ({
           amount: fromCoin(amount, scale, ratio),
           symbol: symbol
         }))
}

// convertToCoin :: String -> Number -> String -> Object -> Maybe({value: Number)
const convertFiatToCoin = (network, amount, currency, rates) => {
  const scaleM = Maybe.fromNullable(coinScale(network))
  const ratioM = Maybe.fromNullable(path([currency, 'last'], rates))
  return sequence(Maybe.of, [ratioM, scaleM])
         .map(([ratio, scale]) => ({
           amount: toCoin(amount, scale, ratio)
         }))
}

const scale = {
  bitcoin: {
    BTC: { name: 'bitcoin', symbol: 'BTC', ratio: 0.00000001, decimals: 8 },
    MBC: { name: 'milli-bitcoin', symbol: 'mBTC', ratio: 0.00001, decimals: 5 },
    UBC: { name: 'micro-bitcoin', symbol: 'bits', ratio: 0.01, decimals: 2 },
    base: { name: 'satoshi', symbol: 'SAT', ratio: 1, decimals: 0 }
  }
}

// getRatio :: Number -> Number -> Maybe (Number)
const getRatio = (network, unit) => path([network, unit, 'ratio'], scale)

// getDecimals :: Number -> Number -> Maybe (Number)
const getDecimals = (network, unit) => path([network, unit, 'decimals'], scale)

// getDecimals :: Number -> Number -> Maybe (Number)
const getSymbol = (network, unit) => path([network, unit, 'symbol'], scale)

export {
  convertCoinToFiat,
  convertFiatToCoin,
  convertToUnit,
  convertFromUnit,
  displayCoin,
  displayFiat,
  getRatio,
  getDecimals,
  getSymbol
}
