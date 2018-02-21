import { contains, equals, isNil, isEmpty } from 'ramda'
import { log } from 'util';

const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

const guidRegex = new RegExp(/(^([0-9A-Fa-f]{8}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{12})$)/)

const ipListRegex = new RegExp(/(^$)|(^(\s?(?:(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|%)\.){3}(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|%)\s?)(,(\s?(?:(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|%)\.){3}(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|%)\s?)*)?$)/)

const isNumeric = value => (value - 0) === value && ('' + value).trim().length > 0

const isEmail = value => emailRegex.test(value)

const isGuid = value => guidRegex.test(value)

const isIpList = value => ipListRegex.test(value)

const isBitcoinFiatAvailable = (country, currency, rates) => {
  if (isNil(country)) return false
  if (isNil(currency)) return false
  // if (isNil(bitcoinOptions)) return false
  // if (!bitcoinOptions.availability.fiat) return false
  // if (!equals(bitcoinOptions.countries, '*') && !contains(bitcoinOptions.countries, country)) return false
  // if (!equals(bitcoinOptions.states, '*') && equals(country, 'US') && !contains(bitcoinOptions.states, state)) return false
  if (isEmpty(rates)) return false
  return true
}

const isEthereumFiatAvailable = (country, currency, rates, ethereumOptions) => {
  if (isNil(country)) return false
  if (isNil(currency)) return false
  if (isNil(ethereumOptions)) return false
  if (!ethereumOptions.availability.fiat) return false
  if (!equals(ethereumOptions.countries, '*') && !contains(ethereumOptions.countries, country)) return false
  // if (!equals(bitcoinOptions.states, '*') && equals(country, 'US') && !contains(bitcoinOptions.states, state)) return false
  if (isEmpty(rates)) return false
  return true
}

const formatSSN = (val, prevVal) => {
  const nums = val.replace(/[^\d]/g, '')
  if (!prevVal || val.length > prevVal.length) {
    if (nums.length === 3) {
      return nums + '-'
    }
    if (nums.length === 5) {
      return nums.slice(0, 3) + '-' + nums.slice(3) + '-'
    }
  }
  if (nums.length <= 3) {
    return nums
  }
  if (nums.length <= 5) {
    return nums.slice(0, 3) + '-' + nums.slice(3)
  }
  return nums.slice(0, 3) + '-' + nums.slice(3, 5) + '-' + nums.slice(5, 9)
}

const formatDOB = (val, prevVal) => {
  console.log('formatDOB', val, prevVal)
  const nums = val.replace(/[^\d]/g, '')
  if (!prevVal || val.length > prevVal.length) {
    if (nums.length === 2) {
      return nums + '/'
    }
    if (nums.length === 4) {
      return nums.slice(0, 2) + '/' + nums.slice(2, 4) + '/'
    }
  }
  if (nums.length <= 2) {
    return nums
  }
  if (nums.length <= 4) {
    return nums.slice(0, 2) + '/' + nums.slice(2)
  }
  return nums.slice(0, 2) + '/' + nums.slice(2, 4) + '/' + nums.slice(4, 8)
}

export {
  isNumeric,
  isEmail,
  isGuid,
  isIpList,
  isBitcoinFiatAvailable,
  isEthereumFiatAvailable,
  formatSSN,
  formatDOB
}
