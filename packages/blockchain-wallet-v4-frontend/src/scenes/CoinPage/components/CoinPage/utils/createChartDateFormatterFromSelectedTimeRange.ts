import moment from 'moment'

import { TimeRange } from '@core/types'

type DateFormatter = (date: number) => string

const dateFormatters: Record<TimeRange, DateFormatter> = {
  [TimeRange.ALL]: (date) => moment(date).format('DD/MM/YYYY'),
  [TimeRange.DAY]: (date) => moment(date).format('HH:mm'),
  [TimeRange.MONTH]: (date) => moment(date).format('DD/MM/YYYY'),
  [TimeRange.WEEK]: (date) => moment(date).format('DD/MM/YYYY'),
  [TimeRange.YEAR]: (date) => moment(date).format('DD/MM/YYYY')
}

export const createDateFormatterFromSelectedTimeRange = (timeRange: TimeRange): DateFormatter =>
  dateFormatters[timeRange]
