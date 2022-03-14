import { useMemo } from 'react'
import { scaleTime, TimeDomain } from '@visx/scale'
import { extent } from 'd3-array'

export const useTimeScale = <DATA extends unknown = unknown>({
  data,
  getX,
  range
}: {
  data: DATA[]
  getX: (data: DATA) => Date
  range: [number, number]
}) => {
  return useMemo(() => {
    const domain = extent(data, getX) as [Date, Date]

    return scaleTime({
      domain,
      nice: true,
      range
    })
  }, [data, getX, range])
}

export type ScaleTime = ReturnType<typeof useTimeScale>
