import { is } from 'ramda'

/* Number */
export const isNumber = is(Number)

export const isInteger = x => isNumber(x) && x % 1 === 0

export const isPositiveInteger = x => isInteger(x) && x >= 0

export const isPositiveNumber = x => isNumber(x) && x >= 0

/* String */
export const isString = is(String)

export const isHex = x => isString(x) && /^[A-Fa-f0-9]+$/.test(x)
