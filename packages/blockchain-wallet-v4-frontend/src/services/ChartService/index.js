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

const selectPriceIndexSeriesOptions = (coin, timeframe) => {
  switch (timeframe) {
    case 'year':
      return {
        start: moment().subtract(1, 'year').format('X'),
        scale: SCALES.DAY,
        interval: INTERVALS.DAY
      }
    case 'month':
      return {
        start: moment().subtract(1, 'month').format('X'),
        scale: SCALES.TWOHOUR,
        interval: INTERVALS.DAY
      }
    case 'week':
      return {
        start: moment().subtract(7, 'day').format('X'),
        scale: SCALES.HOUR,
        interval: INTERVALS.HOUR
      }
    case 'day':
      return {
        start: moment().subtract(1, 'day').format('X'),
        scale: SCALES.FIFTEENMIN,
        interval: INTERVALS.HOUR
      }
    default:
      return {
        start: coin === 'BTC' ? BTCSTART : ETHSTART,
        scale: SCALES.FIVEDAY,
        interval: INTERVALS.DAY
      }
  }
}

export {
  selectPriceIndexSeriesOptions
}
