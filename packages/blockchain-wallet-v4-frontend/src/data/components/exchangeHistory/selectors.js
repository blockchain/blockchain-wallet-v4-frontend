import { path } from 'ramda'

export const getTrades = path(['components', 'exchangeHistory', 'trades'])

export const loadingNextPage = path([
  'components',
  'exchangeHistory',
  'loadingNextPage'
])

export const allFetched = path(['components', 'exchangeHistory', 'allFetched'])
