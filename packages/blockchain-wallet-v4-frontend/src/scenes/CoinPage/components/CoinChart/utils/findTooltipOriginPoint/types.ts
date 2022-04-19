import { EventType } from '@visx/event/lib/types'

import { ScaleTime } from 'components/Chart'

export type FindTooltipOriginPointArgs<DATA> = {
  data: DATA[]
  event: EventType
  getX: (value: DATA) => Date
  xScale: ScaleTime
}

export type FindTooltipOriginPoint = <DATA extends unknown = unknown>({
  data,
  event,
  getX,
  xScale
}: FindTooltipOriginPointArgs<DATA>) => {
  cursorLeft: number
  cursorTop: number
  dataPoint: DATA
}
