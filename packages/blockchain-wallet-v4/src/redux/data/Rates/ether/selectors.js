import { path, prop } from 'ramda'

export const getEthRates = prop('ethRates')
export const getEthRate = currencyCode => path(['ethRates', currencyCode])
