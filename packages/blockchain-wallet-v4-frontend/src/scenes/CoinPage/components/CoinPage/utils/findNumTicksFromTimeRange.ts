import { TimeRange } from '@core/types'

export const findNumTicksFromTimeRange = (timeRange: TimeRange): number => {
  const mapTimeRangeToNumTicks: Record<TimeRange, number> = {
    [TimeRange.ALL]: 6,
    [TimeRange.DAY]: 4,
    [TimeRange.MONTH]: 3,
    [TimeRange.WEEK]: 4,
    [TimeRange.YEAR]: 6
  }

  return mapTimeRangeToNumTicks[timeRange]
}
