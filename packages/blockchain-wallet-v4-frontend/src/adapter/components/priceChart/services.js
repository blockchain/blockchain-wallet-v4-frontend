import { map, prop } from 'ramda'
import moment from 'moment'

const INTERVALS = {
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000
}

const SCALES = {
  FIFTEENMIN: 15 * 60,
  HOUR: 60 * 60,
  TWOHOUR: 2 * 60 * 60,
  DAY: 24 * 60 * 60,
  FIVEDAY: 5 * 24 * 60 * 60
}

const BTCSTART = 1282089600

const ETHSTART = 1438992000

const BCHSTART = 1500854400

const start = {
  'BTC': BTCSTART,
  'ETH': ETHSTART,
  'BCH': BCHSTART
}

export const calculateStart = (coin, time) => {
  const coinStart = prop(coin, start)
  const now = moment()
  const dayStart = now.subtract(1, 'day')
  const weekStart = now.subtract(7, 'day')
  const monthStart = now.subtract(1, 'month')
  const yearStart = now.subtract(1, 'year')

  switch (time) {
    case 'year': return yearStart > coinStart ? yearStart.format('X') : coinStart
    case 'month': return monthStart > coinStart ? monthStart.format('X') : coinStart
    case 'week': return weekStart > coinStart ? weekStart.format('X') : coinStart
    case 'day': return dayStart > coinStart ? dayStart.format('X') : coinStart
    default: return coinStart
  }
}

export const calculateScale = (coin, time) => {
  switch (time) {
    case 'year': return SCALES.DAY
    case 'month': return SCALES.TWOHOUR
    case 'week': return SCALES.HOUR
    case 'day': return SCALES.FIFTEENMIN
    default: return SCALES.FIVEDAY
  }
}

export const calculateInterval = (coin, time) => {
  switch (time) {
    case 'year': return INTERVALS.DAY
    case 'month': return INTERVALS.DAY
    case 'week': return INTERVALS.HOUR
    case 'day': return INTERVALS.HOUR
    default: return INTERVALS.DAY
  }
}
