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

// TODO: erc20 phase 2, remove hardcoded list
export const initialPriceChange = {
  AAVE: Remote.NotAsked,
  ALGO: Remote.NotAsked,
  BCH: Remote.NotAsked,
  BTC: Remote.NotAsked,
  CLOUT: Remote.NotAsked,
  DOGE: Remote.NotAsked,
  DOT: Remote.NotAsked,
  ETH: Remote.NotAsked,
  EUR: Remote.Success(DEFAULT_PRICE_CHANGE),
  GBP: Remote.Success(DEFAULT_PRICE_CHANGE),
  PAX: Remote.NotAsked,
  USD: Remote.Success(DEFAULT_PRICE_CHANGE),
  USDT: Remote.NotAsked,
  WDGLD: Remote.NotAsked,
  XLM: Remote.NotAsked,
  YFI: Remote.NotAsked
}

export const start: { [key in string]: number } = {
  AAVE: 0,
  ALGO: 0,
  BCH: 1500854400,
  BTC: 1282089600,
  CLOUT: 0,
  DOGE: 0,
  DOT: 0,
  ETH: 1438992000,
  PAX: 0,
  USDT: 0,
  WDGLD: 0,
  XLM: 1409788800,
  YFI: 0
}

export const calculateStart = (coin: CoinType, time: TimeRange) => {
  const coinStart = prop(coin, start)
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
