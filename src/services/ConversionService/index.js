import { path, sequence, map } from 'ramda'
import Maybe from 'data.maybe'

// convert :: Number -> Number -> Number -> Maybe (Number)
const toUnit = (amount, ratio, decimals) => parseFloat((amount * ratio).toFixed(decimals))

// convert :: Number -> String -> Maybe (Number)
const convertBitcoinToUnit = (amount, unit) => {
  switch (unit) {
    case 'UBC': return Maybe.Just({ amount: toUnit(amount, 0.01, 2), symbol: unit })
    case 'MBC': return Maybe.Just({ amount: toUnit(amount, 0.00001, 2), symbol: unit })
    case 'BTC': return Maybe.Just({ amount: toUnit(amount, 0.00000001, 2), symbol: unit })
    default: return Maybe.Just(amount)
  }
}

const convertEthereumToUnit = (amount, unit) => {
  switch (unit) {
    default: return Maybe.Nothing()
  }
}

// convert :: String -> Number -> String -> Maybe (Number)
const convertToUnit = (coin, amount, unit) => {
  switch (coin) {
    case 'bitcoin': return convertBitcoinToUnit(amount, unit)
    case 'ethereum': return convertEthereumToUnit(amount, unit)
    default: return Maybe.Nothing()
  }
}

const coinScale = coin => {
  switch (coin) {
    case 'bitcoin':
      return 100000000
    case 'ethereum':
      return 100000000
    default:
      return undefined
  }
}

const toCoin = (amount, scale, ratio) => amount * scale / ratio

const fromCoin = (amount, scale, ratio) => amount * ratio / scale

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
  coinScale
}
