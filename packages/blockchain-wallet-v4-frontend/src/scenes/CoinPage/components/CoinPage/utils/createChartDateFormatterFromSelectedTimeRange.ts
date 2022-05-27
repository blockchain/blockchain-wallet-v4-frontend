import { format } from 'date-fns'

import { TimeRange } from '@core/types'

type DateFormatter = (date: number) => string

const dateFormatters: Record<TimeRange, DateFormatter> = {
  [TimeRange.ALL]: (date) => format(new Date(date), 'yyyy'),
  [TimeRange.DAY]: (date) => format(new Date(date), 'h:mm aaa').toUpperCase(),
  [TimeRange.MONTH]: (date) => format(new Date(date), 'MMMM d'),
  [TimeRange.WEEK]: (date) => format(new Date(date), 'MMMM d'),
  [TimeRange.YEAR]: (date) => format(new Date(date), 'MMMM')
}

export const createDateFormatterFromSelectedTimeRange = (timeRange: TimeRange): DateFormatter =>
  dateFormatters[timeRange]
