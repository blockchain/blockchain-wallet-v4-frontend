import moment from 'moment'
import { prop } from 'ramda'

import Remote from 'blockchain-wallet-v4/src/remote/remote'
import { CoinType } from 'core/types'

import { PriceChangeType, TimeRange } from './types'

export const DEFAULT_PRICE_CHANGE: PriceChangeType = {
  currentPrice: 1,
  overallChange: {
    diff: '0',
    movement: 'none',
    percentChange: '0'
  },
  positionChange: {
    diff: '0',
    movement: 'none',
    percentChange: '0'
  },
  previousPrice: 1
}

export const initialPriceChange = {}

export const start: { [key in string]: number } = {
  BCH: 1500854400,
  BTC: 1282089600,
  ETH: 1438992000,
  XLM: 1409788800
}

export const calculateStart = (coin: CoinType, time: TimeRange) => {
  const coinStart = start[coin] || 0
  const dayStart = moment().subtract(1, 'day').format('X')
  const weekStart = moment().subtract(7, 'day').format('X')
  const monthStart = moment().subtract(1, 'month').format('X')
  const yearStart = moment().subtract(1, 'year').format('X')

  switch (time) {
    case 'all':
      return coinStart
    case 'year':
      // @ts-ignore
      return yearStart > coinStart ? yearStart : coinStart
    case 'month':
      // @ts-ignore
      return monthStart > coinStart ? monthStart : coinStart
    case 'week':
      // @ts-ignore
      return weekStart > coinStart ? weekStart : coinStart
    case 'day':
      // @ts-ignore
      return dayStart > coinStart ? dayStart : coinStart
    default:
      return coinStart
  }
}
