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

export const calculateScale = (coin, time) => {
  switch (time) {
    case 'all':
      return SCALES.FIVEDAY
    case 'year':
      return SCALES.DAY
    case 'month':
      return SCALES.TWOHOUR
    case 'week':
      return SCALES.HOUR
    case 'day':
      return SCALES.FIFTEENMIN
    default:
      return SCALES.FIVEDAY
  }
}

export const calculateInterval = (coin, time) => {
  switch (time) {
    case 'year':
      return INTERVALS.DAY
    case 'month':
      return INTERVALS.DAY
    case 'week':
      return INTERVALS.HOUR
    case 'day':
      return INTERVALS.HOUR
    default:
      return INTERVALS.DAY
  }
}
