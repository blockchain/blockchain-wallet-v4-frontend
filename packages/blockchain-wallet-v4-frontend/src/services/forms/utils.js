import moment from 'moment'

import { CRYPTO_DECIMALS, FIAT_DECIMALS } from './constants'

const emailRegex = new RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
)
const guidRegex = new RegExp(
  /(^([0-9A-Fa-f]{8}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{12})$)/
)
const IpRegex = new RegExp(
  /^((?:(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|%)\.){3}(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|%))$/
)
const emailCodeRegex = new RegExp(/^[a-z0-9]{5}$/i)
const isNumeric = value => value - 0 === value && ('' + value).trim().length > 0
const isEmail = value => emailRegex.test(value)
const isGuid = value => guidRegex.test(value)
const isIpValid = value => IpRegex.test(value.trim())
const isAlphaNumeric = value => emailCodeRegex.test(value)
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
const formatUSZipcode = val => {
  if (val.length > 5) return val.slice(0, 5)
  return val
}
const isOverEighteen = val => {
  const dob = new Date(val)
  const now = new Date()
  const eighteenYearsAgo = now.setFullYear(now.getFullYear() - 18)
  // @ts-ignore
  return dob < eighteenYearsAgo
}
const isSSN = val => {
  if (val && val.length) {
    const cleaned = val.replace(/[^\d]/g, '')
    return cleaned.length === 9
  }
  return val
}
const isDOB = val => {
  if (val && val.length) {
    const cleaned = val.replace(/[^\d]/g, '')
    return cleaned.length === 8 && moment(val).isValid()
  }
  return val
}
const isUsZipcode = val => {
  if (val && val.length) {
    const cleaned = val.replace(/[^\d]/g, '')
    return cleaned.length === 5
  }
  return val
}
const formatTextAmount = (val, isFiat) => {
  const decimals = isFiat ? FIAT_DECIMALS : CRYPTO_DECIMALS
  return val
    .replace(/^0+(.)/, ($0, $1) => $1)
    .replace(/^\./, '0.')
    .replace(new RegExp(`(.*\\..{${decimals}}).*`), ($0, $1) => $1)
    .replace('-', '')
}

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

export {
  capitalizeFirstLetter,
  formatDOB,
  formatSSN,
  formatTextAmount,
  formatUSZipcode,
  isAlphaNumeric,
  isDOB,
  isEmail,
  isGuid,
  isIpValid,
  isNumeric,
  isOverEighteen,
  isSSN,
  isUsZipcode
}
