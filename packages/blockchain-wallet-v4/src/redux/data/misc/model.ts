import Remote from 'blockchain-wallet-v4/src/remote/remote'
import moment from 'moment'
import { prop } from 'ramda'

import { CoinType } from 'core/types'
import { PriceChangeTimeRangeType, PriceChangeType } from './types'

export const DEFAULT_PRICE_CHANGE: PriceChangeType = {
  currentPrice: 1,
  previousPrice: 1,
  overallChange: {
    percentChange: '0',
    diff: '0',
    movement: 'none'
  },
  positionChange: {
    diff: '0',
    percentChange: '0',
    movement: 'none'
  }
}

export const initialPriceChange = {
  BTC: Remote.NotAsked,
  ETH: Remote.NotAsked,
  BCH: Remote.NotAsked,
  XLM: Remote.NotAsked,
  ALGO: Remote.NotAsked,
  PAX: Remote.NotAsked,
  USDT: Remote.NotAsked,
  WDGLD: Remote.NotAsked,
  EUR: Remote.Success(DEFAULT_PRICE_CHANGE),
  GBP: Remote.Success(DEFAULT_PRICE_CHANGE),
  USD: Remote.Success(DEFAULT_PRICE_CHANGE)
}

export const start: { [key in CoinType]: number } = {
  BTC: 1282089600,
  ETH: 1438992000,
  BCH: 1500854400,
  XLM: 1409788800,
  ALGO: 0,
  USDT: 0,
  PAX: 0,
  WDGLD: 0
}

export const calculateStart = (
  coin: CoinType,
  time: PriceChangeTimeRangeType
) => {
  const coinStart = prop(coin, start)
  const dayStart = moment()
    .subtract(1, 'day')
    .format('X')
  const weekStart = moment()
    .subtract(7, 'day')
    .format('X')
  const monthStart = moment()
    .subtract(1, 'month')
    .format('X')
  const yearStart = moment()
    .subtract(1, 'year')
    .format('X')

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
