import { EventType } from '@visx/event/lib/types'
import { Numeric } from 'd3-array'

import { ScaleLinear, ScaleTime } from 'components/Chart'

export type ShowTooltipArgs<DATA> = {
  data: DATA[]
  getX: (value: DATA) => Date
  getY: (value: DATA) => Numeric
  xScale: ScaleTime
  yScale: ScaleLinear
}

export type ShowTooltipResult<DATA> = {
  cursorLeft: number
  cursorTop: number
  hideTooltip: () => void
  showTooltip: (event: EventType) => void
  tooltipData?: DATA
  tooltipLeft: number
  tooltipOpen: boolean
  tooltipTop: number
}
