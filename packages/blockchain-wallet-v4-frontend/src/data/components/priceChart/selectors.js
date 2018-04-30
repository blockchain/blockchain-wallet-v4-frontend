import { path, prop } from 'ramda'

export const getPriceChart = prop('priceChart')

export const getCoin = path(['components', 'priceChart', 'coin'])

export const getTime = path(['components', 'priceChart', 'time'])
