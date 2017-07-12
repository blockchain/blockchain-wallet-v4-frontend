import { contains, path } from 'ramda'
import Maybe from 'data.maybe'
import { isNumeric } from 'services/ValidationHelper'

const numberFormat = new Intl.NumberFormat()

// convertToBitcoin :: Integer -> String -> Maybe (String)
function convertToBitcoin (satoshiAmount, unit) {
  const value = (amount, unit) => `${amount} ${unit}`
  const convert = (amount, ratio, decimals) => parseFloat((amount / ratio).toFixed(decimals))

  if (!contains(unit, ['UBC', 'MBC', 'BTC'])) { return Maybe.Nothing() }
  if (!isNumeric(satoshiAmount)) { return Maybe.Nothing() }

  switch (unit) {
    case 'UBC':
      return Maybe.Just(value(convert(satoshiAmount, 100, 2), 'bits'))
    case 'MBC':
      return Maybe.Just(value(convert(satoshiAmount, 100000, 5), 'mBTC'))
    case 'BTC':
      return Maybe.Just(value(convert(satoshiAmount, 100000000, 8), 'BTC'))
    default:
      return Maybe.Nothing()
  }
}

function convertToCurrency (satoshiAmount, currency, rates) {
  const value = (amount, currency) => `${currency}${numberFormat.format(amount)}`
  const convert = (amount, ratio) => parseFloat((amount * ratio / 100000000).toFixed(2))

  if (!isNumeric(satoshiAmount)) return Maybe.Nothing()

  let record = path([currency], rates)
  let ratio = path(['last'], record)
  if (!ratio || !isNumeric(ratio)) return Maybe.Nothing()

  let currencySymbol = path(['symbol'], record)
  if (!currencySymbol) return Maybe.Nothing()

  return Maybe.Just(value(convert(satoshiAmount, ratio), currencySymbol))
}

const convertCoinToCurrency = (amount, currency, rates) => {
  const convert = (amount, ratio) => parseFloat((parseFloat(amount) * ratio / 100000000).toFixed(2))

  let ratio = path([[currency], 'last'], rates)
  if (!ratio) return Maybe.Nothing()

  return Maybe.Just(convert(amount, ratio))
}

const convertCurrencyToCoin = (amount, currency, rates) => {
  const convert = (amount, ratio) => parseFloat((parseFloat(amount) / ratio * 100000000).toFixed(2))

  let ratio = path([[currency], 'last'], rates)
  if (!ratio) return Maybe.Nothing()

  return Maybe.Just(convert(amount, ratio))
}

export {
  convertToBitcoin,
  convertToCurrency,
  convertCoinToCurrency,
  convertCurrencyToCoin
}
