import { useMemo } from 'react'
import { scaleLinear } from '@visx/scale'
import { max, min, Numeric } from 'd3-array'

export const useLinearScale = <DATA extends unknown = unknown>({
  data,
  getY,
  range
}: {
  data: DATA[]
  getY: (datum: DATA) => Numeric
  range: [number, number]
}) => {
  const maxY = useMemo(() => max(data, getY), [data, getY])
  const minY = useMemo(() => min(data, getY), [data, getY])

  if (maxY === undefined || minY === undefined) {
    throw Error('No data to build linear scale hook')
  }

  return useMemo(() => {
    const yDomain = [minY.valueOf(), maxY.valueOf()]

    return scaleLinear({
      domain: yDomain,
      range
    })
  }, [minY, maxY, range])
}

export type ScaleLinear = ReturnType<typeof useLinearScale>
