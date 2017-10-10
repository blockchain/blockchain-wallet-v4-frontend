import { path } from 'ramda'

export const getBtcRates = path(['rates', 'bitcoin'])

export const getBtcRate = currencyCode => path(['rates', 'bitcoin', currencyCode])

export const getEthRates = path(['rates', 'ethereum'])

export const getEthRate = currencyCode => path(['rates', 'ethereum', currencyCode])
