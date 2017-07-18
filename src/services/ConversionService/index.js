import { path, sequence, map, type } from 'ramda'
import Maybe from 'data.maybe'

// toUnit :: Number -> Number -> Number -> Maybe (Number)
const toUnit = (amount, ratio, decimals) => parseFloat((amount / ratio).toFixed(decimals))

// fromUnit :: Number -> Number -> Number -> Maybe (Number)
const fromUnit = (amount, ratio) => parseFloat(amount * ratio)

// toCoin :: Number -> Number -> Number -> Maybe (Number)
const toCoin = (amount, scale, ratio) => parseFloat(amount * scale / ratio)

// fromCoin :: Number -> Number -> Number -> Maybe (Number)
const fromCoin = (amount, scale, ratio) => parseFloat((amount / scale * ratio).toFixed(2))

// convertBitcoinToUnit :: Number -> String -> Maybe (Number)
const convertBitcoinToUnit = (amount, unit) => {
  switch (unit) {
    case 'UBC': return Maybe.Just({ amount: toUnit(amount, 100, 3), symbol: unit })
    case 'MBC': return Maybe.Just({ amount: toUnit(amount, 100000, 5), symbol: unit })
    case 'BTC': return Maybe.Just({ amount: toUnit(amount, 100000000, 8), symbol: unit })
    default: return Maybe.Just(amount)
  }
}

// convert :: String -> Number -> String -> Maybe (Number)
const convertToUnit = (network, amount, unit) => {
  switch (network) {
    case 'bitcoin': return convertBitcoinToUnit(amount, unit)
    default: return Maybe.Nothing()
  }
}

// convert :: Number -> String -> Maybe (Number)
const convertBitcoinFromUnit = (amount, unit) => {
  switch (unit) {
    case 'UBC': return Maybe.Just({ amount: fromUnit(amount, 100), symbol: 'satoshis' })
    case 'MBC': return Maybe.Just({ amount: fromUnit(amount, 100000), symbol: 'satoshis' })
    case 'BTC': return Maybe.Just({ amount: fromUnit(amount, 100000000), symbol: 'satoshis' })
    default: return Maybe.Just(amount)
  }
}

// convertFromUnit :: String -> Number -> String -> Maybe (Number)
const convertFromUnit = (network, amount, unit) => {
  switch (network) {
    case 'bitcoin': return convertBitcoinFromUnit(amount, unit)
    default: return Maybe.Nothing()
  }
}

const displayCoin = (network, amount, unit) => {
  const decimals = path([network, unit, 'decimals'], scale)
  return (type(amount) === 'Number' && decimals && unit) ? Maybe.fromNullable(`${amount.toFixed(decimals)} ${unit}`) : Maybe.Nothing()
}

const displayFiat = (amount, currency) => {
  return (type(amount) === 'Number' && currency) ? Maybe.Just(`${amount.toFixed(2)} ${currency}`) : Maybe.Nothing()
}

// convertFromUnit :: String -> Number
const coinScale = network => {
  switch (network) {
    case 'bitcoin': return 100000000
    default: return undefined
  }
}

const scale = {
  bitcoin: {
    BTC: { name: 'bitcoin', ratio: 1, decimals: 8 },
    MBC: { name: 'milli-bitcoin', ratio: 1000, decimals: 5 },
    UBC: { name: 'micro-bitcoin', ratio: 1000000, decimals: 2 },
    base: { name: 'satoshi', ratio: 100000000, decimals: 0 }
  }
}

// convertToCurrency :: String -> Number -> String -> Array -> Maybe({value: Number, symbol:'$'})
const convertCoinToFiat = (network, amount, currency, rates) => {
  const scaleM = Maybe.fromNullable(coinScale(network))
  const dataM = map(x => Maybe.fromNullable(path([currency, x], rates)), ['last', 'symbol'])
  return sequence(Maybe.of, dataM.concat(scaleM))
         .map(([ratio, symbol, scale]) => ({
           amount: fromCoin(amount, scale, ratio),
           symbol: symbol
         }))
}

// convertToCoin :: String -> Number -> String -> Array -> Maybe({value: Number)
const convertFiatToCoin = (network, amount, currency, rates) => {
  const scaleM = Maybe.fromNullable(coinScale(network))
  const ratioM = Maybe.fromNullable(path([currency, 'last'], rates))
  return sequence(Maybe.of, [ratioM, scaleM])
         .map(([ratio, scale]) => ({
           amount: toCoin(amount, scale, ratio)
         }))
}

export {
  convertCoinToFiat,
  convertFiatToCoin,
  convertToUnit,
  convertFromUnit,
  displayCoin,
  displayFiat,
  coinScale
}
