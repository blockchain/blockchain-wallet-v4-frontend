import { path } from 'ramda'

export const getFee = path(['adapter', 'data', 'btc', 'fee'])

export const getRates = path(['adapter', 'data', 'btc', 'rates'])
