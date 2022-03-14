import moment from 'moment'

import { TimeRange } from '@core/types'

type DateFormatter = (date: number) => string

const dateFormatters: Record<TimeRange, DateFormatter> = {
  [TimeRange.ALL]: (date) => moment(date).format('YYYY'),
  [TimeRange.DAY]: (date) => moment(date).format('h:mm a').toUpperCase(),
  [TimeRange.MONTH]: (date) => moment(date).format('MMM D'),
  [TimeRange.WEEK]: (date) => moment(date).format('MMM D'),
  [TimeRange.YEAR]: (date) => moment(date).format('MMMM')
}

export const createDateFormatterFromSelectedTimeRange = (timeRange: TimeRange): DateFormatter =>
  dateFormatters[timeRange]
