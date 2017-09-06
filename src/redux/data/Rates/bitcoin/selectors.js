import { path, prop } from 'ramda'

export const getBtcRates = prop('btcRates')
export const getBtcRate = currencyCode => path(['btcRates', currencyCode])
