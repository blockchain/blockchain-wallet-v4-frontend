import { contains, path } from 'ramda'
import { isNumeric } from './validationHelper'

function convertToBitcoin (satoshiAmount, unit) {
  let result = {
    success: false,
    amount: 0,
    unit: '',
    value: ''
  }

  if (!contains(unit, ['UBC', 'MBC', 'BTC'])) { return result }

  if (!isNumeric(satoshiAmount)) { return result }

  switch (unit) {
    case 'UBC':
      result.amount = parseFloat((satoshiAmount / 100).toFixed(2))
      result.unit = 'bits'
      break
    case 'MBC':
      result.amount = parseFloat((satoshiAmount / 100000).toFixed(5))
      result.unit = 'mBTC'
      break
    case 'BTC':
      result.amount = parseFloat((satoshiAmount / 100000000).toFixed(8))
      result.unit = 'BTC'
      break
  }

  result.success = true
  result.value = `${result.amount} ${result.unit}`

  return result
}

function convertToCurrency (satoshiAmount, currency, rates) {
  let result = {
    success: false,
    amount: 0,
    currency: '',
    value: ''
  }

  if (!isNumeric(satoshiAmount)) {
    return result
  }

  let record = path([currency], rates)
  let ratio = path(['last'], record)
  if (!ratio | !isNumeric(ratio)) { return result }

  let currencySymbol = path(['symbol'], record)
  if (!currencySymbol) { return result }

  result.success = true
  result.amount = parseFloat((satoshiAmount * ratio / 100000000).toFixed(2))
  result.currency = currencySymbol
  result.value = `${result.amount} ${result.currency}`

  return result
}

export {
  convertToBitcoin,
  convertToCurrency
}
