import { path, sequence, map } from 'ramda'
import Maybe from 'data.maybe'

// toUnit :: Number -> Number -> Number -> Maybe (Number)
const toUnit = (amount, ratio, decimals) => parseFloat((amount / ratio).toFixed(decimals))

// fromUnit :: Number -> Number -> Number -> Maybe (Number)
const fromUnit = (amount, ratio) => parseFloat(amount * ratio)

// toCoin :: Number -> Number -> Number -> Maybe (Number)
const toCoin = (amount, scale, ratio) => parseFloat(amount * scale / ratio)

// fromCoin :: Number -> Number -> Number -> Maybe (Number)
const fromCoin = (amount, scale, ratio) => parseFloat(amount / scale * ratio).toFixed(2)

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
const convertToUnit = (coin, amount, unit) => {
  switch (coin) {
    case 'bitcoin': return convertBitcoinToUnit(amount, unit)
    default: return Maybe.Nothing()
  }
}

// convert :: Number -> String -> Maybe (Number)
const convertBitcoinFromUnit = (amount, unit) => {
  switch (unit) {
    case 'UBC': return Maybe.Just({ amount: fromUnit(amount, 100), symbol: unit })
    case 'MBC': return Maybe.Just({ amount: fromUnit(amount, 100000), symbol: unit })
    case 'BTC': return Maybe.Just({ amount: fromUnit(amount, 100000000), symbol: unit })
    default: return Maybe.Just(amount)
  }
}

// convertFromUnit :: String -> Number -> String -> Maybe (Number)
const convertFromUnit = (coin, amount, unit) => {
  switch (coin) {
    case 'bitcoin': return convertBitcoinFromUnit(amount, unit)
    default: return Maybe.Nothing()
  }
}

// convertFromUnit :: String -> Number
const coinScale = coin => {
  switch (coin) {
    case 'bitcoin': return 100000000
    default: return undefined
  }
}

// convertToCurrency :: String -> Number -> String -> Array -> Maybe({value: Number, symbol:'$'})
const convertCoinToFiat = (coin, amount, currency, rates) => {
  const scaleM = Maybe.fromNullable(coinScale(coin))
  const dataM = map(x => Maybe.fromNullable(path([currency, x], rates)), ['last', 'symbol'])
  return sequence(Maybe.of, dataM.concat(scaleM))
         .map(([ratio, symbol, scale]) => ({
           amount: fromCoin(amount, scale, ratio),
           symbol: symbol
         }))
}

// convertToCoin :: String -> Number -> String -> Array -> Maybe({value: Number)
const convertFiatToCoin = (coin, amount, currency, rates) => {
  const scaleM = Maybe.fromNullable(coinScale(coin))
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
  coinScale
}
