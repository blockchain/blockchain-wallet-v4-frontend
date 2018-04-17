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
const start = { 'BTC': BTCSTART, 'ETH': ETHSTART, 'BCH': BCHSTART }

const selectPriceIndexSeriesOptions = (coin, timeframe) => {
  switch (timeframe) {
    case 'year':
      const yearStart = moment().subtract(1, 'year')
      return {
        start: yearStart.format('X'),
        scale: SCALES.DAY,
        interval: INTERVALS.DAY
      }
    case 'month':
      const monthStart = moment().subtract(1, 'month')
      return {
        start: monthStart.format('X'),
        scale: SCALES.TWOHOUR,
        interval: INTERVALS.DAY
      }
    case 'week':
      const weekStart = moment().subtract(7, 'day')
      return {
        start: weekStart.format('X'),
        scale: SCALES.HOUR,
        interval: INTERVALS.HOUR
      }
    case 'day':
      const dayStart = moment().subtract(1, 'day')
      return {
        start: dayStart.format('X'),
        scale: SCALES.FIFTEENMIN,
        interval: INTERVALS.HOUR
      }
    default:
      return {
        start: start[coin],
        scale: SCALES.FIVEDAY,
        interval: INTERVALS.DAY
      }
  }
}

export {
  selectPriceIndexSeriesOptions
}
