import { localPoint } from '@visx/event'
import { bisectLeft } from 'd3-array'

import { FindTooltipOriginPoint } from './types'

export const findTooltipOriginPoint: FindTooltipOriginPoint = ({ data, event, getX, xScale }) => {
  const { x, y } = localPoint(event) || { x: 0, y: 0 }

  const x0 = xScale.invert(x)

  const index = bisectLeft(data.map(getX), x0, 1)

  const d0 = data[index - 1]
  const d1 = data[index]
  let dataPoint = d0

  if (d1 && getX(d1)) {
    dataPoint = x0.valueOf() - getX(d0).valueOf() > getX(d1).valueOf() - x0.valueOf() ? d1 : d0
  }

  return {
    cursorLeft: x,
    cursorTop: y,
    dataPoint
  }
}
