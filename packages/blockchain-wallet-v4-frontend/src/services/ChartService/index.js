import { prop } from 'ramda'
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
  const now = moment()
  const coinStart = prop(coin, start)
  const dayStart = now.subtract(1, 'day').format('X')
  const weekStart = now.subtract(7, 'day').format('X')
  const monthStart = now.subtract(1, 'month').format('X')
  const yearStart = now.subtract(1, 'year').format('X')

  switch (time) {
    case '1year': return yearStart > coinStart ? yearStart : coinStart
    case '1month': return monthStart > coinStart ? monthStart : coinStart
    case '1week': return weekStart > coinStart ? weekStart : coinStart
    case '1day': return dayStart > coinStart ? dayStart : coinStart
    default: return coinStart
  }
}

export const calculateScale = (coin, time) => {
  switch (time) {
    case '1year': return SCALES.DAY
    case '1month': return SCALES.TWOHOUR
    case '1week': return SCALES.HOUR
    case '1day': return SCALES.FIFTEENMIN
    default: return SCALES.FIVEDAY
  }
}

export const calculateInterval = (coin, time) => {
  switch (time) {
    case '1year': return INTERVALS.DAY
    case '1month': return INTERVALS.DAY
    case '1week': return INTERVALS.HOUR
    case '1day': return INTERVALS.HOUR
    default: return INTERVALS.DAY
  }
}
