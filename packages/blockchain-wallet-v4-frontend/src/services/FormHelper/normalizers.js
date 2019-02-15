import {
  formatSSN,
  formatDOB,
  formatUSZipcode
} from 'services/ValidationHelper'

export const normalizeSocialSecurity = (val, prevVal) => formatSSN(val, prevVal)

export const normalizeDateOfBirth = (val, prevVal) => formatDOB(val, prevVal)

export const normalizeUSZipcode = value => formatUSZipcode(value)

export const removeWhitespace = string => string.replace(/\s/g, ``)
