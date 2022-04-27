import { getTime, millisecondsToSeconds, subDays, subMonths, subYears } from 'date-fns'

import { CoinType } from '@core/types'

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
  const dayStart = millisecondsToSeconds(getTime(subDays(new Date(), 1)))
  const weekStart = millisecondsToSeconds(getTime(subDays(new Date(), 7)))
  const monthStart = millisecondsToSeconds(getTime(subMonths(new Date(), 1)))
  const yearStart = millisecondsToSeconds(getTime(subYears(new Date(), 1)))

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
