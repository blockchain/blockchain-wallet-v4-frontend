import { path, prop } from 'ramda'

export const getRates = prop('rates')
export const getRate = currencyCode => path(['rates', currencyCode])
