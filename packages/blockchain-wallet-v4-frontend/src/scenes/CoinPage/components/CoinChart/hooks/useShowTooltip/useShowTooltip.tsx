import { useCallback, useState } from 'react'
import { EventType } from '@visx/event/lib/types'
import { useTooltip } from '@visx/tooltip'

import { findTooltipOriginPoint } from '../../utils/findTooltipOriginPoint'
import { ShowTooltipArgs, ShowTooltipResult } from './types'

export const useShowTooltip = <DATA extends unknown = unknown>({
  data,
  getX,
  getY,
  xScale,
  yScale
}: ShowTooltipArgs<DATA>): ShowTooltipResult<DATA> => {
  const [cursorPosition, setCursorPosition] = useState<{ cursorLeft: number; cursorTop: number }>({
    cursorLeft: 0,
    cursorTop: 0
  })

  const {
    hideTooltip,
    showTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipOpen,
    tooltipTop = 0
  } = useTooltip<DATA>()

  const handleShowTooltip = useCallback(
    (event: EventType) => {
      const { cursorLeft, cursorTop, dataPoint } = findTooltipOriginPoint({
        data,
        event,
        getX,
        xScale
      })

      const left = xScale(getX(dataPoint))
      const top = yScale(getY(dataPoint))

      showTooltip({
        tooltipData: dataPoint,
        tooltipLeft: left,
        tooltipTop: top
      })

      setCursorPosition({
        cursorLeft,
        cursorTop
      })
    },
    [setCursorPosition]
  )

  const handleHideTooltip = useCallback(() => {
    hideTooltip()
  }, [setCursorPosition, hideTooltip])

  return {
    ...cursorPosition,
    hideTooltip: handleHideTooltip,
    showTooltip: handleShowTooltip,
    tooltipData,
    tooltipLeft,
    tooltipOpen,
    tooltipTop
  }
}
